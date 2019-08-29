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
    // Clear local storage of the user's token
    cy.clearLocalStorage();

    // Reset the database
    cy.exec(`cd server && prisma reset -f`)
      // Create a new user using the API
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
      // Use ORM to create Dialogs, Roles, and Lines
      .then(async () => {

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

      });
  });

  specify(`Typical user interaction`, () => {
    // Visit the choose role page
    cy.visit(`dialogs/${dialog.id}/choose-role`, {
        onBeforeLoad: function (window) {
          // and before the page finishes loading
          // set the id_token in local storage
          window.sessionStorage.setItem('token', user.token);
        },
      }).should((window) => {
        expect(window.location.pathname).to.equal(`/dialogs/${dialog.id}/choose-role`);
      })
      // Choose role and be redirected to practice page
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
      // Verify line 1 is shown and other lines are not shown
      .then(() => {
        cy.contains(line1.text);

        cy.contains(line2.text)
          .should("not.exist");

        cy.contains(line3.text)
          .should("not.exist");

        cy.contains(line4.text)
          .should("not.exist");
      })
      // Assert there is only one next line button and click it
      .then(() => {
        cy.contains(/next line/i)
          .should("have.lengthOf", 1)
          .click();
      })
      // Verify that line 1 and line 2 are shown and other lines are not shown
      .then(() => {

        cy.contains(line1.text);

        cy.contains(line2.text);

        cy.contains(line3.text)
          .should("not.exist");

        cy.contains(line4.text)
          .should("not.exist");
      })
      // Assert that there is only one next line button and click it
      .then(() => {
        cy.contains(/next line/i)
          .should("have.lengthOf", 1)
          .click();
      })
      // Assert that the line guess input is shown, type a guess in it, then submit the form
      .then(() => {
        cy.get(`[data-testid="line-guess"]`)
          .within(($lineGuess) => {
            cy.get(`[data-testid="line-guess__text-input"]`)
              .type(line3Guess);

            cy.wrap($lineGuess)
              .submit();
          });
      })
      // Assert that lines 1-3 are shown, guess for line 3 is shown, and line 4 is not shown
      .then(() => {

        cy.contains(line1.text);

        cy.contains(line2.text);

        cy.contains(line3.text);

        cy.contains(line3Guess);

        cy.contains(line4.text)
          .should("not.exist");
      })
      // Assert that there is only 1 next line button and click it
      .then(() => {
        cy.contains(/next line/i)
          .should("have.lengthOf", 1)
          .click();
      })
      // Assert that all the lines and guesses are shown and neither next line button nor line guess input is shown
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

  it(`should load the correct dialog`, () => {
    // Set up Cypress to record outgoing and incoming AJAX requests
    cy.server();
    cy.route({
      method: 'POST',
      url: 'localhost:4000',
    }).as('api');

    // Visit the choose role page
    cy.visit(`dialogs/${dialog.id}/choose-role`, {
        onBeforeLoad: function (window) {
          // and before the page finishes loading
          // set the id_token in local storage
          window.sessionStorage.setItem('token', user.token);
        },
      })
      .should((window) => {
        expect(window.location.pathname).to.equal(`/dialogs/${dialog.id}/choose-role`);
      })
      // Wait for choose role page to query for the available roles
      .then(() => {
        cy.wait("@api");
      })
      // Choose role and be redirected to practice page
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
      // Assert that a request was made for a dialog, and that the dialog in the response matches the one we created
      .then(() => {
        cy.wait("@api").then((xhr) => {
          const responseDialog = xhr.response.body.data.dialog;
          expect(responseDialog).to.deep.equal({
            name: dialog.name,
            languageCode: dialog.languageCode,
            lines: [
              {
                ...line1,
                role: {
                  ...role1,
                }
              },
              {
                ...line2,
                role: {
                  ...role1,
                }
              },
              {
                ...line3,
                role: {
                  ...role2,
                }
              },
              {
                ...line4,
                role: {
                  ...role1,
                }
              },
            ]
          });
        });
      });
  });
});
