
describe("Dialog Edit Page", () => {

  // user token
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjano1aWlkbGIwMDAzMDc2NmNxYzJwbDFvIiwiaWF0IjoxNTY1NDM5OTIxfQ.DGZ3m6mZftHS5LODRKhl80DzHfFPXyxzpE-vKgHdQKY";

  const role1 = {
    id: "123",
    name: "John",
  };
  const role2 = {
    id: "456",
    name: "Jane",
  };

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

  specify(`Given a dialog which has 0 lines
        And the dialog has two roles
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
        debugger;
        const $parentComponent = $dialogNameInput.parents(`[data-testid="dialog-with-update-and-delete"]`).eq(0);
        const $practiceLink = $parentComponent.find("a:contains('Edit')");
        cy.wrap($practiceLink)
          .click()
          .url()
          .should("include", "/edit");
      });
  })
});
