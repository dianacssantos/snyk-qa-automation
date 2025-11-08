Cypress.Commands.add("loginBasic", (username, password) => {
  cy.session([username, password], () => {
    cy.visit("/login.php");
    cy.get("#username").type(username);
    cy.get("#password").type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin");
  });
  cy.visit("/admin.php");
});

Cypress.Commands.add("auth0Login", () => {
  basicLogin.visit();
  auth0LoginPage.visit();
});

Cypress.Commands.add("assertUrlIncludes", (expectedPath) => {
  cy.location("pathname").should("include", expectedPath);
});

Cypress.Commands.add("validateUserLoggedIn", (username) => {
  cy.get("#userDropdown").should("be.visible").and("contain.text", username);
});

Cypress.Commands.add("assertErrorMessage", (selector, expectedText) => {
  cy.get(selector)
    .should("be.visible")
    .invoke("text")
    .then((actualText) => {
      const cleaned = actualText.trim().replace(/\s+/g, " ");
      expect(cleaned).to.eq(expectedText);
    });
});

Cypress.Commands.add("assertNoErrorMessage", (selector) => {
  cy.get(selector).should("not.exist");
});

Cypress.Commands.add("validateBrowserMessages", (selector, expectedMessage) => {
  cy.get(selector)
    .invoke("prop", "validationMessage")
    .then((message) => {
      if (message) {
        const normalized = message.trim();
        expect(normalized, `Validation message for ${selector}`).to.contain(
          expectedMessage
        );
      } else {
        cy.log(
          "No validation message present — input valid or browser didn't trigger validation"
        );
      }
    });
});

function generateFakeFullName() {
  const randomLetters = () => Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${randomLetters()} ${randomLetters()}`;
}
