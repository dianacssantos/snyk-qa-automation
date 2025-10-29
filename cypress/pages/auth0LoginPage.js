class Auth0LoginPage {
  auth0Origin = "https://dev-r2c3iyx2vbmmovdt.us.auth0.com";
  errorMessage = "#error-element-password"; 
  continueButton = 'button[type="submit"][name="action"]';
  blockedMessage = "#prompt-alert";
  emailInput = "#username";


  elements = {
    enterLogin: () => cy.get("#login-auth0"),
    emailInput: () => cy.get("#username"),
    passwordInput: () => cy.get("#password"),
    showPasswordButton: () => cy.get('button[data-action="toggle"]'),
    continueButton: () => cy.get('button[type="submit"][name="action"]'),
    emptyEmailErrorMessage: () => cy.get("#error-cs-username-required"),
    emptyPassErrorMessage: () => cy.get("#error-cs-password-required"),
  //  googleButton: () => cy.contains("Continue with Google"),
  };

  visit() {
    this.elements.enterLogin().click();
  }

  validateEmptyFields() {
    this.elements.continueButton().click();
    this.elements.emailInput().then(($input) => {
      expect($input[0].validationMessage).to.contain("Please fill in");
    });
    this.elements.passwordInput().then(($input) => {
      expect($input[0].validationMessage).to.contain("Please fill in");
    });
  }

  fillCredentials(email, password) {
    cy.origin(
      "https://dev-r2c3iyx2vbmmovdt.us.auth0.com",
      { args: { email, password } },
      ({ email, password }) => {
        if (email) cy.get("#username").clear().type(email);
        if (password) {
          cy.get("#password").clear().type(password, { log: false });
          cy.get('button[data-action="toggle"]').click(); // show password
        }
      }
    );
    return this;
  }

  submit() {
    cy.origin(
      this.auth0Origin,
      { args: { selector: this.continueButton } },
      ({ selector }) => {
        cy.get(selector).click();
      }
    );
  }

  assertError(message, selector) {
    cy.origin(
      this.auth0Origin,
      { args: { message, selector } },
      ({ message, selector }) => {
        cy.get(selector)
          .should("be.visible")
          .invoke("text")
          .then((actualText) => {
            const cleaned = actualText.trim().replace(/\s+/g, " ");
            expect(cleaned).to.contain(message);
          });
      }
    );
  }

  assertBlockedAccount(message) {
    cy.origin(
      this.auth0Origin,
      { args: { selector: this.blockedMessage, message } },
      ({ selector, message}) => {
        cy.get(selector)
          .should("be.visible")
          .and("contain.text", message);
      }
    );
  }

  // TODO: login with Google 

  // loginWithGoogle() {
  //   this.elements.googleButton().click();
  //   // Handle Google OAuth flow
  //   return new AdminPage();
  // }
}


export default new Auth0LoginPage();
