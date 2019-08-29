/// <reference types="Cypress" />

import {prisma} from "../../../server/src/generated/prisma-client";

context('updateLine', () => {

  let user;
  let dialog;
  let role1;
  let role2;
  let line1;
  let line2;
  let line3;

  beforeEach(() => {
    
    cy.clearLocalStorage();

    // Reset the database
    cy.exec(`cd server && npx prisma reset -f`)
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

      });
  });

  specify(`Update multiple lines at once`, () => {

    let currentDialogs;
    let updatedLines;
    let queryVariablesForUpdateLine;

    updatedLines = [
      {
        "id": line1.id,
        "number": 4,
        "text": "This is the text for line 4.",
        "roleId": role2.id, // Swap line 2 role with line 1 role, etc for other lines
      },
      {
        "id": line2.id,
        "number": 5,
        "text": "This is the text for line 5.",
        "roleId": role1.id,
      },
      {
        "id": line3.id,
        "number": 6,
        "text": "This is the text for line 6.",
        "roleId": role2.id,
      }
    ];

    queryVariablesForUpdateLine = {
      lines: updatedLines,
    };

    cy.request({
      url: Cypress.env("api_url"),
      method: "POST",
      headers: {
        "Authorization": `Bearer ${user.token}`,
      },
      body: {
        "operationName": "UpdateLine",
        "variables": queryVariablesForUpdateLine,
        "query":
          `
          mutation UpdateLine($lines: [LineInput!]!) {
            updateLine(lines: $lines) {
              id
              number
              text
              role {
                id
              }
            }
          }
        `,
      },
    })
    .should((response) => {
      expect(response.body).to.deep.equal({
        "data": {
          "updateLine": [
            {
              id: updatedLines[0].id,
              number: updatedLines[0].number,
              text: updatedLines[0].text,
              role: {
                id: updatedLines[0].roleId
              }
            },
            {
              id: updatedLines[1].id,
              number: updatedLines[1].number,
              text: updatedLines[1].text,
              role: {
                id: updatedLines[1].roleId
              }
            },
            {
              id: updatedLines[2].id,
              number: updatedLines[2].number,
              text: updatedLines[2].text,
              role: {
                id: updatedLines[2].roleId
              }
            },
          ],
        }
      });
    });
  });
});
