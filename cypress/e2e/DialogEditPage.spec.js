
describe("Dialog Edit Page", () => {

  // user token
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjano1aWlkbGIwMDAzMDc2NmNxYzJwbDFvIiwiaWF0IjoxNTY1NDM5OTIxfQ.DGZ3m6mZftHS5LODRKhl80DzHfFPXyxzpE-vKgHdQKY";

  const role1Name = "John";
  const role2Name = "Jane";

  const line1Text = "This is the text for line 1.";
  const line2Text = "This is the text for line 2.";
  const line3Text = "This is the text for line 3.";

  const dialogId = "cjz63uiqi001a0766afqkfuec";

  before(() => {
    cy.server();
    cy.route({
      method: 'POST',
      url: 'localhost:4000',
    }).as('api');
  });

  beforeEach(() => {
    // Load database with one user whose token corresponds to the above token
    cy.exec(`cat ${Cypress.env('sql_dump_directory')}one-dialog-with-two-roles.sql | ` +
      `docker exec -i ${Cypress.env('docker_mysql_service_name')} ` +
      `mysql -uroot -p${Cypress.env('docker_mysql_password')} ${Cypress.env('docker_mysql_db_name')}`);

    // Clear local storage of the user's token
    cy.clearLocalStorage();
  });

  specify(`Automatic line numbering when adding, deleting, or moving lines`, () => {

    cy.visit(`/dialogs/${dialogId}/edit`, {
      onBeforeLoad: function(window){
        // and before the page finishes loading
        // set the id_token in local storage
        window.sessionStorage.setItem('token', token);
      }
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

    // Verify generated line number is correct
    cy.get(`[data-testid="line-with-update-and-delete"]`)
      .should("have.lengthOf", 1)
      .eq(0)
      .then(($line1) => {
        // Verify that the line text matches what we entered in the add new line form
        cy.wrap($line1)
          .find(`[value="${line1Text}"]`);

        cy.wrap($line1)
          .find("label")
          .contains(/line number/i)
          .siblings("input")
          .should("have.value", "1");
      });

    // Wait for confirmation that the new line has been added to the database
    cy.wait('@api').then((xhr) => {
      expect(xhr.response.body.data.createLine).to.have.property("text", line1Text);
      expect(xhr.response.body.data.createLine).to.have.property("number", 1);
    });

    // Add line 2
    cy.get(`[data-testid="add-new-line-form"]`)
      .then(($addNewLineForm) => {
        cy.wrap($addNewLineForm)
          .find("label")
          .contains(/role/i)
          .siblings("select")
          .select(role2Name)
          .should(($select) => {
            expect($select.find("option:selected").text()).to.equal(role2Name);
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
      .eq(1).then(($line2) => {

        // Verify that the line text matches what we entered in the add new line form
        cy.wrap($line2)
          .find(`[value="${line2Text}"]`);

        cy.wrap($line2)
          .find("label:contains(Line Number)")
          .siblings("input")
          .should("have.value", "2");
      });

    // Wait for confirmation that the new line has been added to the database
    cy.wait('@api').then((xhr) => {
      expect(xhr.response.body.data.createLine).to.have.property("text", line2Text);
      expect(xhr.response.body.data.createLine).to.have.property("number", 2);
    });

    // Add line 3
    cy.get(`[data-testid="add-new-line-form"]`)
      .then(($addNewLineForm) => {
        cy.wrap($addNewLineForm)
          .find("label:contains(Role)")
          .siblings("select")
          .select(role1Name)
          .should(($select) => {
            expect($select.find("option:selected").text()).to.equal(role1Name);
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
      .eq(2).then(($line3) => {
      // Verify that the line text matches what we entered in the add new line form
      cy.wrap($line3)
        .find(`[value="${line3Text}"]`);

      cy.wrap($line3)
        .find("label:contains(Line Number)")
        .siblings("input")
        .should("have.value", "3");
    });

    // Wait for confirmation that the new line has been added to the database
    cy.wait('@api').then((xhr) => {
      expect(xhr.response.body.data.createLine).to.have.property("text", line3Text);
      expect(xhr.response.body.data.createLine).to.have.property("number", 3);
    });

    // Delete the 2nd line
    cy.get(`[data-testid="line-with-update-and-delete"]`)
      .eq(1)
      .contains("Delete Line")
      .click();

    cy.get(`[data-testid="line-with-update-and-delete"]`)
      .should("have.lengthOf", 2);

    // Verify new line numbers of remaining two lines after the middle line was deleted
    cy.get(`[data-testid="line-with-update-and-delete"]`)
      .then(($lines) => {
        cy.wrap($lines)
          .eq(0)
          .find("label:contains(Line Number)")
          .siblings("input")
          .should("have.value", "1");

        cy.wrap($lines)
          .eq(1)
          .find("label:contains(Line Number)")
          .siblings("input")
          .should("have.value", "2");
      });

    // deleteLine query
    cy.wait('@api').then((xhr) => {
      expect(xhr.response.body.data.deleteLine).to.equal(true);
    });

    // updateLine query
    cy.wait('@api').then((xhr) => {
      const lines = xhr.response.body.data.updateLine;
      const lineNumbers = lines.map((line) => {
        return line.number;
      });
      expect(lineNumbers).to.have.length(2);
      expect(lineNumbers).to.have.members([1, 2]);
    });
  })
});
