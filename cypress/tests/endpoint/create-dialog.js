/// <reference types="Cypress" />

context('createDialog', () => {
  beforeEach(() => {
    // Clear local storage of the user's token
    cy.clearLocalStorage();
  });

  specify(`When I send a createDialog mutation
      Then I should get the correct response`, () => {

    let user;

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
      .then(() => {
        const variables = {
          name: "Dialog 1.1",
          languageCode: "en-US",
        };

        cy.request({
          url: Cypress.env("api_url"),
          method: "POST",
          headers: {
            "Authorization": `Bearer ${user.token}`,
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
        })
          .should((response) => {
            expect(response.body).to.deep.equal({
              "data": {
                "createDialog": {
                  "name": "Dialog 1.1",
                  "languageCode":"en-US"
                }
              }
            });
          });
      });
  });
});
