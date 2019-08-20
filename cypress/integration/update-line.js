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

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjano1aWlkbGIwMDAzMDc2NmNxYzJwbDFvIiwiaWF0IjoxNTY1NDM5OTIxfQ.DGZ3m6mZftHS5LODRKhl80DzHfFPXyxzpE-vKgHdQKY";
    const currentDialogs = [
      {
        "lines": [
          {
            "id": "cjz9xb4e002rb0766w1kdlgw5",
            "number": 1,
            "text": "This is the text for line 1.",
            "role": {
              "id": "cjz9xb3i102qw0766ubr6dvc3",
              "name": "John"
            }
          },
          {
            "id": "cjz9xb58s02rj0766m18izy5c",
            "number": 2,
            "text": "This is the text for line 2.",
            "role": {
              "id": "cjz9xb3t202r3076635xxmoqm",
              "name": "Jane"
            }
          },
          {
            "id": "cjz9xb60m02rr0766hzo76vqf",
            "number": 3,
            "text": "This is the text for line 3.",
            "role": {
              "id": "cjz9xb3i102qw0766ubr6dvc3",
              "name": "John"
            }
          }
        ]
      }
    ];

    // Get current line data so we can make sure that we actually changed the line data
    cy.request({
      url: Cypress.config().baseUrl,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
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
    }).should((response) => {
      expect(response.body).to.deep.equal({
        "data": {
          "dialogs": currentDialogs,
        }
      });
    });

    const updatedLines = [
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
    // This includes the fields that we want to use to update the lines
    const variables = {
      lines: updatedLines,
    };

    cy.request({
      url: Cypress.config().baseUrl,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: {
        "operationName": "UpdateLine",
        "variables": variables,
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
