import {prisma} from "../../../server/src/generated/prisma-client";

describe("Practice Page", () => {

  let user;
  let dialog;
  let role1;
  let role2;
  let line1;
  let line2;
  let line3;

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
      Then line 1 should be displayed
      And the user should be presented with the Next Line button
      When the user clicks the Next Line Button
      Then line 2 should be displayed
      And the user should be presented with the Next line button
      When the user clicks the Next Line Button
      Then the user should be presented with the guess input for line 3`, () => {

    cy.exec(`cd server && prisma reset -f`)
      .then(async () => {
        user = await prisma.createUser({
          email: Cypress.env("test_user_email"),
          password: Cypress.env("test_user_password"),
          name: "Test User",
        });

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

      });
  });

});
