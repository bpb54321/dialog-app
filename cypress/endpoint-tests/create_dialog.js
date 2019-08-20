/// <reference types="Cypress" />

context('createDialog', () => {
  specify(`When I send a createDialog mutation, ` +
    `Then I should get the correct response`, () => {

    // Seed the database with a single user
    cy.exec('prisma reset --force').its('code').should('eq', 0);
    cy.exec('prisma import --data ./prisma/seed-data/single-user.zip')
      .its('code').should('eq', 0);

    const variables = {
      name: "Dialog 1.1",
      languageCode: "en-US",
    };

    const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanluY3Y4MTFnZHMzMGI5OXB0dTcxYzNtIiwiaWF0IjoxNTY0MzQyMDUxfQ.JM22aW4z2exbQuJuHcMUxY4DGqP2-LDyJNtILWvzlW8";

    cy.request({
      url: "http://localhost:4000",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${userToken}`,
      },
      body: {
        "operationName": "CreateDialog",
        "variables": variables,
        "query":
          `
            mutation CreateDialog($name: String!, $languageCode: String!) {
              createDialog(name: $name, languageCode: $languageCode) {
                name
                languageCode
              }
            }
          `,
      },
    }).should((response) => {
      expect(response.body).to.deep.equal({
        "data": {
          "createDialog": {
            "name": "Dialog 1.1",
            "languageCode":"en-US"
          }
        }
      });
    })
  });
});
