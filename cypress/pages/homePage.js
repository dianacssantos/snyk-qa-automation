class HomePage {
  elements = {
    basicLogin: () => cy.get("#link-login"),
    login2FAEmail: () => cy.get("#link-login-2fa-email"),
  };

  visit() {
    cy.visit("/");
  }

  goToBasicLogin() {
    this.elements.basicLogin().click();
  }

  goTo2FAEmailLogin() {
    this.elements.login2FAEmail().click();
  }
}

export default new HomePage();
