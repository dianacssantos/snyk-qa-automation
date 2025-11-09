class BasicLogin {
  elements = {
    enterLogin: () => cy.get("#link-login"),
    usernameInput: () => cy.get("#username"),
    passwordInput: () => cy.get("#password"),
    loginButton: () => cy.get('button[type="submit"]'),
    userProfileLink: () => cy.get("#userDropdown"),
    errorMessage: () => cy.get(".card.bg-danger.text-white.shadow"),
  };

  errorBox = ".card.bg-danger";
  userErrorSelector = "#username";
  passErrorSelector = "#password";

  visit() {
    this.elements.enterLogin().click();
  }

  getUserProfile() {
    this.elements.userProfileLink().click();
  }

  fillCredentials(username, password) {
    const cleanedUsernameBox = this.elements.usernameInput().clear();
    const cleanedPasswordBox = this.elements.passwordInput().clear();

    if (username) cleanedUsernameBox.type(username);
    if (password) cleanedPasswordBox.type(password);
    return this;
  }

  submitAndAssertUrl(expectedUrl) {
    this.elements.loginButton().click();
    cy.assertUrlIncludes(expectedUrl);
  }

  assertError(message) {
    cy.assertErrorMessage(this.errorBox, message);
  }

  assertNoAppError() {
    cy.assertNoErrorMessage(this.errorBox);
  }

  validateBrowserErrors(message) {
    cy.validateBrowserMessages(this.userErrorSelector, message);
    cy.validateBrowserMessages(this.passErrorSelector, message);
  }
}
export default new BasicLogin();
