describe("Smoke test", () => {
    it("Makes sure the welcome message comes up", () => {
        cy.visit("http://localhost:3000");
        cy.contains("Hello, world!");
    })
});