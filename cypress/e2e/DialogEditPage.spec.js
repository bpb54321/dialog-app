
describe("Dialog Edit Page", () => {

  // user token
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjano1aWlkbGIwMDAzMDc2NmNxYzJwbDFvIiwiaWF0IjoxNTY1NDM5OTIxfQ.DGZ3m6mZftHS5LODRKhl80DzHfFPXyxzpE-vKgHdQKY";

  const role1Name = "John";
  const role2Name = "Jane";

  const dialogName = "Test Dialog";

  const line1Text = "This is the text for line 1.";
  const line2Text = "This is the text for line 2.";

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
    cy.getByLabelText(/dialog name/i)
      .type(dialogName)
      .getByTestId("add-new-dialog-form")
      .submit();

    // Navigate to Edit Dialog page
    cy.getAllByTestId("dialog-with-update-and-delete")
      .getByDisplayValue(dialogName)
      .then(($dialogNameInput) => {
        const $parentComponent = $dialogNameInput.parents(`[data-testid="dialog-with-update-and-delete"]`).eq(0);
        const $practiceLink = $parentComponent.find("a:contains('Edit')");
        cy.wrap($practiceLink)
          .click()
          .url()
          .should("include", "/edit");
      });

    // Add two roles
    cy.getByLabelText(/role name/i)
      .type(role1Name);

    cy.getByText(/add role/i)
      .click();

    // Add two roles
    cy.getByLabelText(/role name/i)
      .type(role2Name);

    cy.getByText(/add role/i)
      .click();

    // Add line 1
    cy.getByTestId("add-new-line-form")
      .within(() => {
        // Use default role (John), so don't need to select role
      cy.getByLabelText(/line text/i)
          .type(line1Text)
          .getByText(/add line/i)
          .click();
      });

    // Verify generated line number is correct
    cy.getAllByTestId("line-with-update-and-delete")
      .should("have.lengthOf", 1)
      .eq(0).then(($line1) => {
        // Verify that the line text matches what we entered in the add new line form
        cy.wrap($line1)
          .find(`[value="${line1Text}"]`);

        cy.wrap($line1)
          .getByLabelText(/line number/i)
          .should("have.value", "1");
      });

    // Add line 2
    cy.getByTestId("add-new-line-form")
      .within(() => {
        cy.getByLabelText(/role/i)
          .select(role2Name)
          .parents(`[data-testid="add-new-line-form"]`)
          .getByLabelText(/line text/i)
          .type(line2Text)
          .getByText(/add line/i)
          .click();
      });

    cy.get(`[data-testid="line-with-update-and-delete"]`)
      .should("have.lengthOf", 2)
      .eq(1).then(($line2) => {

        // Verify that the line text matches what we entered in the add new line form
        cy.wrap($line2)
          .contains(line2Text);

        cy.wrap($line2)
          .find("label")
          .contains(/line number/i)
          .siblings("input")
          .should("have.value", "2");
      });

  })
});
