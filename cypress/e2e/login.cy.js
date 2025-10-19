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

  it("should show error for invalid username or password when inserting wrong password of an existing username", () => {
    cy.fixture("credentials").then((cred) => {
      loginPage.login(cred.valid.username, cred.notregistered.password);
      cy.log("Username:", cred.valid.username);
      cy.url().should("include", "/login");
      loginPage.selectors
        .errorMessage()
        .should("be.visible")
        .and("contain.text", "Invalid username or password");
    });
  });

  it("should show error for invalid username or password when inserting non registered username", () => {
    cy.fixture("credentials").then((cred) => {
      loginPage.login(cred.notregistered.username, cred.notregistered.password);
      cy.url().should("include", "/login");
      loginPage.selectors
        .errorMessage()
        .should("be.visible")
        .and("contain.text", "Invalid username or password");
    });
  });
});
