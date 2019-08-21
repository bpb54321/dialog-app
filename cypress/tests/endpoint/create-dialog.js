/// <reference types="Cypress" />

context('createDialog', () => {
  specify(`When I send a createDialog mutation
      Then I should get the correct response`, () => {

    // Seed the database with a single user
    cy.exec(`cat ${Cypress.env('sql_dump_directory')}single-user.sql | ` +
      `docker exec -i ${Cypress.env('docker_mysql_service_name')} ` +
      `mysql -uroot -p${Cypress.env('docker_mysql_password')} ${Cypress.env('docker_mysql_db_name')}`);

    const variables = {
      name: "Dialog 1.1",
      languageCode: "en-US",
    };

    cy.request({
      url: Cypress.env("api_url"),
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Cypress.env("test_user_token")}`,
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
