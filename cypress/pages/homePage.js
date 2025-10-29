// import CommonsLoginPage from "./commonsLoginPage";

// class HomePage {
//   elements = {
//     basicLogin: () => cy.get("#link-login"),
//     login2FAEmail: () => cy.get("#link-login-2fa-email"),
//   };

//   visit() {
//     cy.visit("/");
//   }

//   selectLogin(type) {
//     switch (type) {
//       case "basic":
//         this.elements.basicLogin().click();
//         break;
//       case "2fa-email":
//         this.elements.login2FAEmail().click();
//         break;
//       default:
//         throw new Error(`Unknown login type: ${type}`);
//     }
//     return CommonsLoginPage;
//   }
// }

// export default new HomePage();

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
