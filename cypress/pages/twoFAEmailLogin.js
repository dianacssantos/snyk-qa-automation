class TwoFAEmailLogin {
  elements = {
    enterLogin: () => cy.get("#link-login-2fa-email"),
    emailInput: () => cy.get('#email'),
    passwordInput: () => cy.get('#password'),
    loginButton: () => cy.get('button[type="submit"]'),
    errorMessage: () => cy.get('.card.bg-danger.text-white.shadow', { timeout: 1000 }),
    userProfileLink: () => cy.get('#userDropdown')
  }

  emailErrorSelector  = "#email"
  passErrorSelector  = "#password"

  visit() {
    this.elements.enterLogin().click();
  }

  getUserProfile() {
    this.elements.userProfileLink().click();
  }

  validateEmptyFields() {
    this.elements.loginButton().click();
    this.elements.emailInput().then(($input) => {
      expect($input[0].validationMessage).to.contain("Please fill in");
    });
    this.elements.passwordInput().then(($input) => {
      expect($input[0].validationMessage).to.contain("Please fill in");
    });
  }

  fillCredentials(email, password) {
    const cleanedEmailBox = this.elements.emailInput().clear();
    const cleanedPasswordBox = this.elements.passwordInput().clear();

    if (email) cleanedEmailBox.type(email);
    if (password) cleanedPasswordBox.type(password);
    return this;
  }

  submitAndAssert(expectedUrl) {
    this.elements.loginButton().click();
    cy.assertUrlIncludes(expectedUrl);
  }

  assertError(message) {
    cy.assertErrorMessage(this.errorBox, message);
  }

  assertNoError() {
    cy.assertNoErrorMessage(this.errorBox);
  }
  
  validateBrowserErrors(message) {
    cy.validateBrowserMessages(this.emailErrorSelector, message);
    cy.validateBrowserMessages(this.passErrorSelector, message);

  }
}
export default new TwoFAEmailLogin();
