import homePage from "../pages/homePage";
import basicLogin from "../pages/basicLogin";
import auth0LoginPage from "../pages/auth0LoginPage";
import twoFAEmailLogin from "../pages/twoFAEmailLogin";

/**
 * This test suite intends to implement login and authentication tests:
 *
 * Here I used different login end-to-end paths, in order to statisfy acceptance criteria:
 * successfull login on basic login flow
 * wrong password, non existent email, and invalid email addresses
 * form validation.
 *
 * 1. Successful Login (tested here on "Login!" and "Auth0" login options)
 * - Test successful login using the provided valid credentials.
 * - Verify that the user is redirected to the expected landing page.
 *
 * 2. Invalid Credential Handling (tested on "Login!, Login 2FA with email! and Auth0 login options")
 * - Test login attempts with an invalid password for a valid email. (tested on Login! and Auth0 login pages; no valid email for 2FA with email)
 * - Test login attempts with an unregistered/invalid email format (tested on auth0 and 2FAemail logins)
 * - Verify that an appropriate error message is displayed to the user for each invalid attempt (tested on Login!, Login 2FA with email! and Login Auth0 )
 *
 * 3. Form Validation:
 * - Test attempting to log in with empty email and password fields. (tested on Login!, Login 2FA with email! and Auth0 login)
 * - Verify that form validation messages or appropriate prompts are shown.
 */

describe("Login Functionality", () => {
  beforeEach(() => {
    homePage.visit();
  });

  context("Basic Login Tests", () => {
    const { username, password } = Cypress.env("valid_basic_login");

    beforeEach(() => {
      homePage.goToBasicLogin();
    });

    it("should login successfully with valid credentials", () => {
      basicLogin.fillCredentials(username, password);
      basicLogin.submit();
      cy.url().should("include", "/admin.php");
    });

    it("should show error for wrong password", () => {
      basicLogin.fillCredentials(username, "wrongPass123!");
      basicLogin.submit();
      basicLogin.assertError("Invalid username or password");
    });

    it("should show validation for empty fields", () => {
      cy.fixture("emptyFields").then(({ emptyFields }) => {
        emptyFields.forEach(({ email, password, expectedMessage }) => {
          basicLogin.fillCredentials(email, password);
          basicLogin.submit();
          basicLogin.validateBrowserErrors(expectedMessage);
          basicLogin.assertNoAppError();
        });
      });
    });
  });

  context("Auth0 Login Tests", () => {
    const { email, password } = Cypress.env("valid_auth0_login");
    const { emailL, passwordL } = Cypress.env("valid_auth0_login_locked");
    const username = email.split("@")[0];

    it("should login successfully with valid credentials", () => {
      basicLogin.visit();
      auth0LoginPage.visit();
      auth0LoginPage.fillCredentials(email, password);
      auth0LoginPage.submit();
      cy.url().should("include", "/admin.php");
      cy.get("#userDropdown").should("contain.text", username);
    });

    it("should show error for wrong password", () => {
      basicLogin.visit();
      auth0LoginPage.visit();
      auth0LoginPage.fillCredentials(email, "wrongPass123!");
      auth0LoginPage.submit();
      auth0LoginPage.assertError(
        "Wrong email or password",
        "#error-element-password"
      );
    });

    it("should show error for invalid email format", () => {
      basicLogin.visit();
      auth0LoginPage.visit();
      cy.fixture("invalidEmails").then(({ invalidEmails }) => {
        invalidEmails.forEach(({ email, expectedMessage, description }) => {
          cy.log(`Testing: ${email} — ${description}`);
          auth0LoginPage.fillCredentials(email, "thisPass!");
          auth0LoginPage.submit();
          auth0LoginPage.assertError(
            "Wrong email or password",
            "#error-element-password"
          );
        });
      });
    });

    it("should show validation for empty fields", () => {
      basicLogin.visit();
      auth0LoginPage.visit();

      cy.fixture("emptyFieldsAuth0").then(({ emptyFieldsAuth0 }) => {
        emptyFieldsAuth0.forEach(
          ({
            email,
            password,
            expectedEmailFieldMessage,
            expectedPasswordFieldMessage,
          }) => {
            auth0LoginPage.fillCredentials(email, password);
            auth0LoginPage.submit();

            if (expectedEmailFieldMessage) {
              auth0LoginPage.assertError(
                expectedEmailFieldMessage,
                ["#error-cs-username-required", "#error-element-username"]
              );
            }

            if (expectedPasswordFieldMessage) {
              auth0LoginPage.assertError(
                expectedPasswordFieldMessage,
                "#error-cs-password-required"
              );
            }
          }
        );
      });
    });

    it("should show lock message after multiple failed attempts", () => {
      basicLogin.visit();
      auth0LoginPage.visit();

      for (let i = 0; i < 1; i++) {
        auth0LoginPage.fillCredentials(emailL, `Try#${i + 1}`);
        auth0LoginPage.submit();
      }
      auth0LoginPage.assertBlockedAccount("Your account has been blocked");
    });
  });

  context("2FA Email Login Tests", () => {
    it("should show validation for empty fields", () => {
      twoFAEmailLogin.visit();
      cy.fixture("emptyFields").then(({ emptyFields }) => {
        emptyFields.forEach(({ email, password, expectedMessage }) => {
          twoFAEmailLogin.fillCredentials(email, password);
          twoFAEmailLogin.submit();
          twoFAEmailLogin.validateBrowserErrors(expectedMessage);
        });
      });
    });

    it("should show error for invalid email format", () => {
      twoFAEmailLogin.visit();
      cy.fixture("invalidEmails").then(({ invalidEmails }) => {
        invalidEmails.forEach(({ email, description }) => {
          cy.log(`Testing: ${email} — ${description}`);
          twoFAEmailLogin.fillCredentials(email, "thisPass!");
          twoFAEmailLogin.submit();
          cy.url().should("include", "/login2FA_email.php");
          twoFAEmailLogin.validateBrowserErrors("Enter a valid email address");
        });
      });
    });
  });
});
