import {prisma} from "../../../server/src/generated/prisma-client";

describe("Practice Page", () => {

  const role1Name = "Role 1";
  const role2Name = "Role 2";

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
        const userToken = await prisma.createUser({
          email: Cypress.env("test_user_email"),
          password: Cypress.env("test_user_password"),
          name: "Test User",
        });

        console.log(userToken);
      });
  });

});
