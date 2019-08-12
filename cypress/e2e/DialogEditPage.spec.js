
describe("Dialog Edit Page", () => {

  // user token
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjano1aWlkbGIwMDAzMDc2NmNxYzJwbDFvIiwiaWF0IjoxNTY1NDM5OTIxfQ.DGZ3m6mZftHS5LODRKhl80DzHfFPXyxzpE-vKgHdQKY";

  const role1Name = "John";
  const role2Name = "Jane";

  const dialogName = "Test Dialog";

  const line1Text = "This is the text for line 1.";
  const line2Text = "This is the text for line 2.";
  const line3Text = "This is the text for line 3.";

  beforeEach(() => {
    // Load database with one user whose token corresponds to the above token
    cy.exec(`cat ${Cypress.env('sql_dump_directory')}single-user.sql | ` +
      `docker exec -i ${Cypress.env('docker_mysql_service_name')} ` +
      `mysql -uroot -p${Cypress.env('docker_mysql_password')} ${Cypress.env('docker_mysql_db_name')}`);

    // Clear local storage of the user's token
    cy.clearLocalStorage();
  });

  specify(`Given a dialog which has 0 lines and 2 roles
        When we add lines to the dialog
        Then the lines should appear on the page
        And their line numbers should correspond to the order in which they were added.`, () => {

    // Login directly using token
    cy.visit('/', {
      onBeforeLoad: function(window){
        // and before the page finishes loading
        // set the id_token in local storage
        window.sessionStorage.setItem('token', token);
      }
    });

    // Create Test Dialog
    cy.get(`[data-testid="add-new-dialog-form"]`)
      .then(($addNewDialogForm) => {
        cy.get("label")
          .contains(/dialog name/i)
          .siblings("input")
          .type(dialogName)
          .should("have.value", dialogName);

        cy.wrap($addNewDialogForm).submit();
      });

    // Navigate to Edit Dialog page
    cy.get(`[data-testid="dialog-with-update-and-delete"]`)
      .then(($dialogWithUpdateAndDelete) => {
        cy.wrap($dialogWithUpdateAndDelete)
          .find(`[value="${dialogName}"]`);

        cy.wrap($dialogWithUpdateAndDelete)
          .contains(/edit/i)
          .click();

        cy.url()
          .should("include", "/edit");
      });

    // Add two roles

    // Type first role's name in input
    cy.get("label:contains(Role Name)")
      .siblings("input")
      .type(role1Name)
      .should('have.value', role1Name);

    // Add role
    cy.contains("Add Role")
      .click();

    // Verify role was added
    cy.get(`[data-testid="role-with-update-and-delete"]`)
      .should("have.length", 1)
      .eq(0)
      .find(`[data-testid="role-with-update-and-delete__name"]`)
      .should("have.value", role1Name);

    // Type sscond role's name
    cy.get("label:contains(Role Name)")
      .siblings("input")
      .type(role2Name)
      .should('have.value', role2Name);

    // Add role
    cy.contains(/add role/i)
      .click();

    // Verify role was added
    cy.get(`[data-testid="role-with-update-and-delete"]`)
      .should("have.length", 2)
      .eq(1)
      .find(`[data-testid="role-with-update-and-delete__name"]`)
      .should("have.value", role2Name);

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

  })
});
