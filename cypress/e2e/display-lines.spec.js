describe("Smoke test", () => {

    // user token
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjano1aWlkbGIwMDAzMDc2NmNxYzJwbDFvIiwiaWF0IjoxNTY1NDM5OTIxfQ.DGZ3m6mZftHS5LODRKhl80DzHfFPXyxzpE-vKgHdQKY";

    it("Makes sure the welcome message comes up", () => {

        cy.exec(`cat ${Cypress.env('sql_dump_directory')}single-user.sql | ` +
            `docker exec -i ${Cypress.env('docker_mysql_service_name')} ` +
            `mysql -uroot -p${Cypress.env('docker_mysql_password')} ${Cypress.env('docker_mysql_db_name')}`);

        cy.clearLocalStorage();
        cy.visit('/', {
            onBeforeLoad: function(window){
                // and before the page finishes loading
                // set the id_token in local storage
                window.sessionStorage.setItem('token', token);
            }
        });
        cy.contains("Dialogs");
    })
});
