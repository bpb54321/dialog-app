import {prisma} from "../../../server/src/generated/prisma-client";

describe("Dialog Edit Page", () => {
  
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

  specify(`Automatic line numbering when adding or deleting lines`, () => {

    let user;
    let dialog;
    let role1;
    let role2;
    let line1;
    let line2;
    let line3;

    const line1Text = "This is the text for line 1.";
    const line2Text = "This is the text for line 2.";
    const line3Text = "This is the text for line 3.";

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
      })
      // Visit dialog edit page
      .then(() => {
        cy.visit(`/dialogs/${dialog.id}/edit`, {
          onBeforeLoad: function(window){
            // and before the page finishes loading
            // set the id_token in local storage
            window.sessionStorage.setItem('token', Cypress.env(user.token));
          }
        });
      });

    // Wait for the page to request dialogs from the api
    cy.wait('@api');

    // Add lines

    // Add line 1
    cy.get(`[data-testid="add-new-line-form"]`)
      .then(($addNewLineForm) => {
        cy.wrap($addNewLineForm)
          .find(`[data-testid="new-line-text"]`)
          .type(line1Text)
          .should("have.value", line1Text);

        cy.wrap($addNewLineForm)
          .submit();
      });

    // Verify line order is correct
    cy.get(`[data-testid="line-with-update-and-delete"]`)
      .should("have.lengthOf", 1)
      .eq(0)
      .find(`:contains("${line1Text}"), [value="${line1Text}"]`);

    // Wait for confirmation that the new line has been added to the database
    cy.wait('@api').then((xhr) => {
      line1 = xhr.response.body.data.createLine;
      expect(line1).to.have.property("text", line1Text);
      expect(line1).to.have.property("number", 1);
    });

    // Add line 2
    cy.get(`[data-testid="add-new-line-form"]`)
      .then(($addNewLineForm) => {
        cy.wrap($addNewLineForm)
          .find("label")
          .contains(/role/i)
          .siblings("select")
          .select(role2.name)
          .should(($select) => {
            expect($select.find("option:selected").text()).to.equal(role2.name);
          });

        cy.wrap($addNewLineForm)
          .find(`[data-testid="new-line-text"]`)
          .type(line2Text)
          .should("have.value", line2Text);

        cy.wrap($addNewLineForm)
          .submit();
      });

    cy.get(`[data-testid="line-with-update-and-delete"]`)
      .should("have.lengthOf", 2)
      .then(($lines) => {
        cy.wrap($lines)
          .eq(0)
          .find(`:contains("${line1Text}"), [value="${line1Text}"]`);

        cy.wrap($lines)
          .eq(1)
          .find(`:contains("${line2Text}"), [value="${line2Text}"]`);
      });

    // Wait for confirmation that the new line has been added to the database
    cy.wait('@api').then((xhr) => {
      line2 = xhr.response.body.data.createLine;
      expect(line2).to.have.property("text", line2Text);
      expect(line2).to.have.property("number", 2);
    });

    // Add line 3
    cy.get(`[data-testid="add-new-line-form"]`)
      .then(($addNewLineForm) => {
        cy.wrap($addNewLineForm)
          .find("label:contains(Role)")
          .siblings("select")
          .select(role1.name)
          .should(($select) => {
            expect($select.find("option:selected").text()).to.equal(role1.name);
          });

        cy.wrap($addNewLineForm)
          .find(`[data-testid="new-line-text"]`)
          .type(line3Text)
          .should("have.value", line3Text);

        cy.wrap($addNewLineForm)
          .submit();
      });

    cy.get(`[data-testid="line-with-update-and-delete"]`)
      .should("have.lengthOf", 3)
      .then(($lines) => {
        cy.wrap($lines)
          .eq(0)
          .find(`:contains("${line1Text}"), [value="${line1Text}"]`);

        cy.wrap($lines)
          .eq(1)
          .find(`:contains("${line2Text}"), [value="${line2Text}"]`);

        cy.wrap($lines)
          .eq(2)
          .find(`:contains("${line3Text}"), [value="${line3Text}"]`);
      });

    // Wait for confirmation that the new line has been added to the database
    cy.wait('@api').then((xhr) => {
      line3 = xhr.response.body.data.createLine;
      expect(line3).to.have.property("text", line3Text);
      expect(line3).to.have.property("number", 3);
    });

    // Delete the 2nd line
    cy.get(`[data-testid="line-with-update-and-delete"]`)
      .eq(1)
      .contains("Delete Line")
      .click()
      .get(`[data-testid="line-with-update-and-delete"]`)
      .should("have.lengthOf", 2)
      .then(($lines) => {
        cy.wrap($lines)
          .eq(0)
          .find(`:contains("${line1Text}"), [value="${line1Text}"]`);

        cy.wrap($lines)
          .eq(1)
          .find(`:contains("${line3Text}"), [value="${line3Text}"]`);
      });

    // deleteLine query
    cy.wait('@api').then((xhr) => {
      expect(xhr.response.body.data.deleteLine).to.equal(true);
    });

    // updateLine query
    cy.wait('@api').then((xhr) => {
      const lines = xhr.response.body.data.updateLine;
      
      const line1AfterUpdate = lines.find((line) => {
        return (line.id === line1.id);
      });

      const line3AfterUpdate = lines.find((line) => {
        return (line.id === line3.id);
      });

      expect(line1AfterUpdate.number).to.equal(1);
      expect(line3AfterUpdate.number).to.equal(2);
    });
  });

  specify(`Updating line text`, () => {
    let user;
    let dialog;
    let role1;
    let line1;

    const line1Text = "This is the text for line 1.";

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

        line1 = await prisma.createLine({
          number: 1,
          role: {
            connect: {
              id: role1.id,
            }
          },
          text: line1Text,
          dialog: {
            connect: {
              id: dialog.id,
            }
          }
        });
      })
      .then(() => {
        cy.visit(`/dialogs/${dialog.id}/edit`, {
          onBeforeLoad: function(window){
            // and before the page finishes loading
            // set the id_token in local storage
            window.sessionStorage.setItem('token', Cypress.env("test_user_token"));
          }
        });
      });

    // Wait for the page to request dialogs from the api
    cy.wait('@api');

    cy.get(`textarea:contains("${line1Text}"), input[value="${line1Text}"]`)
      .as("line-1-text-input")
      .clear()
      .should("have.value", "");

    cy.wait("@api").then((xhr) => {
      expect(xhr.response.body.data.updateLine[0].text).to.equal("");
    });

    cy.get("@line-1-text-input")
      .type("a")
      .should("have.value", "a");

    cy.wait("@api").then((xhr) => {
      expect(xhr.response.body.data.updateLine[0].text).to.equal("a");
    });

    cy.get("@line-1-text-input")
      .type("b")
      .should("have.value", "ab");

    cy.wait("@api").then((xhr) => {
      expect(xhr.response.body.data.updateLine[0].text).to.equal("ab");
    });
  });

  describe(`Moving lines up and down`, () => {
    specify(`Given a dialog with 3 lines
      When I click the Move Line Up button on the third line
      Then the third line moves to position 2
      And the second line moves to position 3
      And the lines' numbers are updated in the database`, () => {

      cy.exec(`cat ${Cypress.env('sql_dump_directory')}dialog-with-three-lines.sql | ` +
        `docker exec -i ${Cypress.env('docker_mysql_service_name')} ` +
        `mysql -uroot -p${Cypress.env('docker_mysql_password')} ${Cypress.env('docker_mysql_db_name')}`);

      cy.visit(`/dialogs/${dialogId}/edit`, {
        onBeforeLoad: function(window){
          // and before the page finishes loading
          // set the id_token in local storage
          window.sessionStorage.setItem('token', Cypress.env("test_user_token"));
        }
      });

      let originalLine2;
      let originalLine3;

      // Wait for the page to request dialogs from the api
      cy.wait('@api').then((xhr) => {

        originalLine2 = xhr.response.body.data.dialog.lines.filter((line) => {
          return (line.number === 2);
        })[0];

        originalLine3 = xhr.response.body.data.dialog.lines.filter((line) => {
          return (line.number === 3);
        })[0];

      });

      cy.get(`[data-testid="line-with-update-and-delete"]`)
        .eq(2)
        .contains(/move line up/i)
        .click()
        .get(`[data-testid="line-with-update-and-delete"]`)
        .eq(1)
        // Assert that the second line has line3.text
        .find(`textarea:contains("${line3.text}"), input[value="${line3.text}"]`);

      cy.wait("@api").then((xhr) => {

        const updatedLine2 = xhr.response.body.data.updateLine.filter((line) => {
          return (line.id === originalLine2.id);
        })[0];

        const updatedLine3 = xhr.response.body.data.updateLine.filter((line) => {
          return (line.id === originalLine3.id);
        })[0];

        expect(updatedLine3.number).to.equal(2);
        expect(updatedLine2.number).to.equal(3);
      });

    });

    specify(`Given a dialog with 3 lines
      When I click the Move Line Down button on the first line
      Then the first line moves to position 2
      And the second line moves to position 1`, () => {

      cy.exec(`cat ${Cypress.env('sql_dump_directory')}dialog-with-three-lines.sql | ` +
        `docker exec -i ${Cypress.env('docker_mysql_service_name')} ` +
        `mysql -uroot -p${Cypress.env('docker_mysql_password')} ${Cypress.env('docker_mysql_db_name')}`);

      cy.visit(`/dialogs/${dialogId}/edit`, {
        onBeforeLoad: function(window){
          // and before the page finishes loading
          // set the id_token in local storage
          window.sessionStorage.setItem('token', Cypress.env("test_user_token"));
        }
      });

      let originalLine1;
      let originalLine2;

      // Wait for the page to request dialogs from the api
      cy.wait('@api').then((xhr) => {

        originalLine1 = xhr.response.body.data.dialog.lines.filter((line) => {
          return (line.number === 1);
        })[0];

        originalLine2 = xhr.response.body.data.dialog.lines.filter((line) => {
          return (line.number === 2);
        })[0];

      });

      cy.get(`[data-testid="line-with-update-and-delete"]`)
        .eq(0)
        .contains(/move line down/i)
        .click()
        .get(`[data-testid="line-with-update-and-delete"]`)
        .eq(1)
        // Assert that the second line has line1.text
        .find(`textarea:contains("${line1.text}"), input[value="${line1.text}"]`);

      cy.wait("@api").then((xhr) => {

        const updatedLine1 = xhr.response.body.data.updateLine.filter((line) => {
          return (line.id === originalLine1.id);
        })[0];

        const updatedLine2 = xhr.response.body.data.updateLine.filter((line) => {
          return (line.id === originalLine2.id);
        })[0];

        expect(updatedLine1.number).to.equal(2);
        expect(updatedLine2.number).to.equal(1);
      });

    });
  });
});
