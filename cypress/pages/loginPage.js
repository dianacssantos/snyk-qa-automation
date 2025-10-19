class LoginPage {
  // Selectors to find elements
  selectors = {
    loginBasicAuth: () => cy.get("#link-login"),
    usernameInput: () => cy.get("#username"),
    passwordInput: () => cy.get("#password"),
    loginButton: () => cy.get('button[type="submit"]'),
    errorMessage: () =>
      cy.get(".form-group >.card.bg-danger", { timeout: 1000 }),

    // Navigation links from the main page
    login2FALink: () => cy.get("#link-login-2fa"),
    login2FAEmailLink: () => cy.get("#link-login-2fa-email"),
    loginCaptchaLink: () => cy.get("#link-login-captcha-simple"),
  };

  visit() {
    // Visit homepage and click Login!
    cy.visit("/");
    this.selectors.loginBasicAuth().click();
  }

  // Performs login, given an username and a password
  login(username, password) {
    this.selectors.usernameInput().clear().type(username);
    this.selectors.passwordInput().clear().type(password);
    this.selectors.loginButton().click();
  }
}

export default new LoginPage();
