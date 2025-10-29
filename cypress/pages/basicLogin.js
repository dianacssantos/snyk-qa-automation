class BasicLogin {
  
  elements = {
    enterLogin: () => cy.get("#link-login"),
    usernameInput: () => cy.get('#username'),
    passwordInput: () => cy.get('#password'),
    loginButton: () => cy.get('button[type="submit"]'),
    captchaTextBox: () => cy.get('#captcha_value'),
    captchaImg: () => cy.get('#captcha_img'),
    userProfileLink: () => cy.get('#userDropdown'),
    errorMessage: () => cy.get(".card.bg-danger.text-white.shadow"),
  }

  errorBox = ".card.bg-danger";

  visit() {
    this.elements.enterLogin().click();
  }

  getUserProfile() {
    this.elements.userProfileLink().click();
  }

  validateEmptyFields() {
    this.elements.loginButton().click();
    this.elements.usernameInput().then(($input) => {
      expect($input[0].validationMessage).to.contain("Please fill in");
    });
    this.elements.passwordInput().then(($input) => {
      expect($input[0].validationMessage).to.contain("Please fill in");
    });
  }

  fillCredentials(username, password) {
    if (username) this.elements.usernameInput().clear().type(username);
    if (password) this.elements.passwordInput().clear().type(password);
    return this;
  }

  submit() {
    // if (username !== "") {
    //   this.elements.usernameInput().type(username);
    // }
    // if (password !== "") {
    //   this.elements.passwordInput().type(password);
    // }
    this.elements.loginButton().click();
  }

  assertError(message) {
    cy.assertErrorMessage(this.errorBox, message);
  }

  assertNoError() {
    cy.assertNoErrorMessage(this.errorBox);
  }

}
export default new BasicLogin();
