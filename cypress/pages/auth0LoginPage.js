class Auth0LoginPage {
  auth0Origin = "https://dev-r2c3iyx2vbmmovdt.us.auth0.com";

  selectors = {
    enterLogin: "#login-auth0",
    emailInput: "#username",
    passwordInput: "#password",
    showPasswordButton: 'button[data-action="toggle"]',
    continueButton: 'button[type="submit"][name="action"]',
    usernameErrors: ["#error-cs-username-required", "#error-element-username"],
    passwordErrors: ["#error-cs-password-required", "#error-element-password"],
    blockedMessage: "#prompt-alert",
    blockedAccount: "[role='alert'], .ulp-text",
  };

  visit() {
    cy.get(this.selectors.enterLogin).click();
  }

  fillCredentials(email, password) {
    cy.origin(
      this.auth0Origin,
      { args: { email, password } },
      ({ email, password }) => {
        cy.get("#username").clear();
        cy.get("#password").clear();

        if (email) cy.get("#username").type(email);
        if (password) {
          cy.get("#password").type(password);
          cy.get('button[data-action="toggle"]').click();
        }
      }
    );
    return this;
  }

  submit() {
    cy.origin(
      this.auth0Origin,
      { args: { selector: this.selectors.continueButton } },
      ({ selector }) => {
        cy.get(selector).click();
      }
    );
  }

  assertUrl(expectedUrl) {
    cy.location("pathname", { timeout: 10000 }).should("include", expectedUrl);
  }

  assertUrlAuth0(expectedUrl) {
    cy.origin(this.auth0Origin, { args: { url: expectedUrl } }, ({ url }) => {
      cy.location("pathname", { timeout: 10000 }).should("include", url);
    });
  }

  assertError(message, selectorType) {
    const selectors = this.selectors[selectorType] || selectorType;
    
    cy.origin(
      this.auth0Origin,
      { args: { message, selectors } },
      ({ message, selectors }) => {
        const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
        const combinedSelector = selectorArray.join(', ');
        
        cy.get(combinedSelector, { timeout: 10000 })
          .filter(':visible')
          .first()
          .should('be.visible')
          .and('contain.text', message);
      }
    );
  }

  assertBlockedAccount(message) {
    cy.origin(
      this.auth0Origin,
      { args: { selector: this.blockedMessage, message } },
      ({ selector, message }) => {
        cy.get(selector).should("be.visible").and("contain.text", message);
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
