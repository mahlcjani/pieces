
describe("Home page", () => {
  it("Opens and renders nav", () => {
    cy.visit("http://localhost:3000");

    cy.contains("People");
    cy.get("a[href*='/people']").should("have.attr", "href", "/people");

    cy.contains("Calendar");
    cy.get("a[href*='/calendar']").should("have.attr", "href", "/calendar");
  })
})
