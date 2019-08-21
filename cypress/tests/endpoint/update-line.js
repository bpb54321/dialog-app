/// <reference types="Cypress" />

context('updateLine', () => {

  beforeEach(() => {
    // Load database with a specified state
    // One user
    // One dialog
    // Three lines
    cy.exec(`cat ${Cypress.env('sql_dump_directory')}dialog-with-three-lines.sql | ` +
      `docker exec -i ${Cypress.env('docker_mysql_service_name')} ` +
      `mysql -uroot -p${Cypress.env('docker_mysql_password')} ${Cypress.env('docker_mysql_db_name')}`);
  });

  specify(`Update multiple lines at once`, () => {

    let currentDialogs;
    let updatedLines;
    let queryVariablesForUpdateLine;

    // Get current line data so we can make sure that we actually changed the line data
    cy.request({
      url: Cypress.env("api_url"),
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Cypress.env("test_user_token")}`,
      },
      body: {
        "operationName": "Dialogs",
        "variables": {},
        "query":
          `
            query Dialogs {
              dialogs {
                lines {
                  id
                  number
                  text
                  role {
                    id
                    name
                  }
                }
              }
            }
          `,
      },
    }).then((response) => {
      currentDialogs = response.body.data.dialogs;

      updatedLines = [
        {
          "id": currentDialogs[0].lines[0].id,
          "number": 4,
          "text": "This is the text for line 4.",
          "roleId": currentDialogs[0].lines[1].role.id, // Swap line 2 role with line 1 role, etc for other lines
        },
        {
          "id": currentDialogs[0].lines[1].id,
          "number": 5,
          "text": "This is the text for line 5.",
          "roleId": currentDialogs[0].lines[0].role.id,
        },
        {
          "id": currentDialogs[0].lines[2].id,
          "number": 6,
          "text": "This is the text for line 6.",
          "roleId": currentDialogs[0].lines[1].role.id,
        }
      ];

      queryVariablesForUpdateLine = {
        lines: updatedLines,
      };

      cy.request({
        url: Cypress.env("api_url"),
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Cypress.env("test_user_token")}`,
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
      }).should((response) => {
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
});
