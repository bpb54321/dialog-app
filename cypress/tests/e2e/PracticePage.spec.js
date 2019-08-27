import {prisma} from "../../../server/src/generated/prisma-client";

describe("Practice Page", () => {

  let user;
  let dialog;
  let role1;
  let role2;
  let line1;
  let line2;
  let line3;
  const line3Guess = "This is my guess for Line 3";
  let line4;

  beforeEach(() => {
    // Set up Cypress to record outgoing and incoming AJAX requests
    cy.server();
    cy.route({
      method: 'POST',
      url: 'localhost:4000',
    }).as('api');

    // Clear local storage of the user's token
    cy.clearLocalStorage();
  });

  specify(`Given a dialog with at least four lines
      And the first two lines are assigned to Role 1
      And the third line is assigned to Role 2
      And the fourth line is assigned to Role 1
      And the user has chosen Role 2
      When the dialog practice starts
      Then only line 1 should be displayed
      And the user should be presented with a single Next Line button
      When the user clicks the Next Line Button
      Then only line 1 and line 2 should be displayed
      And the user should be presented with a single Next line button
      When the user clicks the Next Line Button
      Then the user should be presented with the guess input for line 3
      When the user makes a guess for line 3 and submits the guess
      Then the submitted guess and the correct text for line 3 should be displayed
      And line 1 and line 2 should also still be displayed
      And the user should be presented with a single Next Line button
      When the user clicks the Next Line button
      Then all the lines should be displayed in the dialog
      And neither the Next Line button nor the guess input should be displayed.`, () => {

    cy.exec(`cd server && prisma reset -f`)
      .then(() => {
        // Must create a new user using the API, otherwise I felt like doing the password encrypion manually
        // was tying the test too much to the internal implementation of the API
        cy.request({
          url: Cypress.env("api_url"),
          method: "POST",
          body: {
            variables: {
              email: Cypress.env("test_user_email"),
              password: Cypress.env("test_user_password"),
              name: "Test User",
            },
            query:
              `
                mutation Signup($email: String!, $password: String!, $name: String!) {
                  signup(email: $email, password: $password, name: $name) {
                    token,
                    user {
                      id
                      name
                      email
                    }
                  }
                }
              `,
          }
        })
        .then((response) => {
          const data = response.body.data.signup;
          user = data.user;
          user.token = data.token;
        });
      })
      .then(async () => {

        // Use ORM to create Dialogs, Roles, and Lines
        dialog = await prisma.createDialog({
          name: "Test Dialog",
          user: {
            connect: {
              id: user.id,
            }
          },
          languageCode: "en-US",
        });

        role1 = await prisma.createRole({
          name: "Role 1",
          dialog: {
            connect: {
              id: dialog.id,
            }
          }
        });

        role2 = await prisma.createRole({
          name: "Role 2",
          dialog: {
            connect: {
              id: dialog.id,
            }
          }
        });

        line1 = await prisma.createLine({
          number: 1,
          role: {
            connect: {
              id: role1.id,
            }
          },
          text: "This is the text for line 1.",
          dialog: {
            connect: {
              id: dialog.id,
            }
          }
        });

        line2 = await prisma.createLine({
          number: 2,
          role: {
            connect: {
              id: role1.id,
            }
          },
          text: "This is the text for line 2.",
          dialog: {
            connect: {
              id: dialog.id,
            }
          }
        });

        line3 = await prisma.createLine({
          number: 3,
          role: {
            connect: {
              id: role2.id,
            }
          },
          text: "This is the text for line 3.",
          dialog: {
            connect: {
              id: dialog.id,
            }
          }
        });

        line4 = await prisma.createLine({
          number: 4,
          role: {
            connect: {
              id: role1.id,
            }
          },
          text: "This is the text for line 4.",
          dialog: {
            connect: {
              id: dialog.id,
            }
          }
        });

      })
      .then(() => {
        cy.visit(`dialogs/${dialog.id}/practice`, {
          onBeforeLoad: function (window) {
            // and before the page finishes loading
            // set the id_token in local storage
            window.sessionStorage.setItem('token', user.token);
          },
        }).should((window) => {
          expect(window.location.pathname).to.equal(`/dialogs/${dialog.id}/choose-role`);
        });
      })
      .then(() => {
        cy.get(`[data-testid="role-picker"]`)
          .within(($rolePicker) => {
            cy.get("select")
              .select("Role 2");

            cy.wrap($rolePicker)
              .submit();
          });

        cy.location("pathname")
          .should("equal", `/dialogs/${dialog.id}/practice`);
      })
      .then(() => {
        cy.contains(line1.text);

        cy.contains(line2.text)
          .should("not.exist");

        cy.contains(line3.text)
          .should("not.exist");

        cy.contains(line4.text)
          .should("not.exist");

        cy.contains(/next line/i)
          .should("have.lengthOf", 1)
          .click();

      })
      .then(() => {

        cy.contains(line1.text);

        cy.contains(line2.text);

        cy.contains(line3.text)
          .should("not.exist");

        cy.contains(line4.text)
          .should("not.exist");

        cy.contains(/next line/i)
          .should("have.lengthOf", 1)
          .click();
      })
      .then(() => {
        cy.get(`[data-testid="line-guess"]`)
          .within(($lineGuess) => {
            cy.get(`[data-testid="line-guess__text-input"]`)
              .type(line3Guess);

            cy.wrap($lineGuess)
              .submit();
          });

        cy.contains(line1.text);

        cy.contains(line2.text);

        cy.contains(line3.text);

        cy.contains(line3Guess);

        cy.contains(line4.text)
          .should("not.exist");

        cy.contains(/next line/i)
          .should("have.lengthOf", 1)
          .click();

      })
      .then(() => {
        cy.contains(line1.text);

        cy.contains(line2.text);

        cy.contains(line3.text);

        cy.contains(line3Guess);

        cy.contains(line4.text);

        cy.contains(/next line/i)
          .should("not.exist");

        cy.get(`[data-testid="line-guess"]`)
          .should("not.exist");
      });







  });
});
