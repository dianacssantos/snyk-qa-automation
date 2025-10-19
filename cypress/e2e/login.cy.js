import loginPage from "../pages/loginPage";

describe("Login Functionality", () => {
  beforeEach(() => {
    // Load login page
    loginPage.visit();
  });

  it("should login successfully with valid credentials", () => {
    cy.fixture("credentials").then((cred) => {
      loginPage.login(cred.valid.username, cred.valid.password);
      cy.url().should("include", "/admin");
      cy.title().should("contain", "cova-dev :: admin");
      cy.contains(`(${cred.valid.username})`).should("be.visible");
    });
  });
});
