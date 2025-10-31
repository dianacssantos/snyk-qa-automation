import homePage from "../pages/homePage";
import basicLogin from "../pages/basicLogin";
import usersPage from "../pages/usersPage";

describe("User List and Search Functionality", () => {
  const { username, password } = Cypress.env("valid_basic_login");

  beforeEach(() => {
    cy.clearCookies();
    homePage.visit();
    homePage.goToBasicLogin();
    basicLogin.fillCredentials(username, password);
    basicLogin.submit();
    usersPage.listUsers();
    cy.url().should("include", "/list_users.php");
  });
  
  context("User List Display", () => {
    it("should display user list with correct user details", () => {
      usersPage.countRows().then((count) => {
        expect(count).to.be.greaterThan(0);
      });
      usersPage.verifyHeaders();
      usersPage.verifyRandomUserRowStructure();
    });
  });

  context("Search Functionality", () => {
    it("should validate full name searches", () => {
      cy.fixture("searchTerms").then(({ fullSearchTerms }) => {
        fullSearchTerms.forEach(({ name, expectedMatches, description }) => {
          cy.log(`Full Search "${name}" — ${description}`);

          usersPage.searchUser(name);
          usersPage.verifySearchResultText(name);

          cy.url().then((url) => {
            const normalizedUrl = decodeURIComponent(url).replace(/\+/g, " ");
            expect(normalizedUrl).to.include(`/list_users.php?search=${name}`);
          });

          usersPage.verifySearchResults(name, true, expectedMatches);
        });
      });
    });

    it("should validate partial name searches", () => {
      cy.fixture("searchTerms").then(({ partialSearchTerms }) => {
        partialSearchTerms.forEach(({ name, expectedMatches, description }) => {
          cy.log(`🔍 [Partial Search] "${name}" — ${description}`);

          usersPage.searchUser(name);

          cy.url().then((url) => {
            const normalizedUrl = decodeURIComponent(url).replace(/\+/g, " ");
            expect(normalizedUrl).to.include(`/list_users.php?search=${name}`);
          });

          usersPage.verifySearchResults(name, false, expectedMatches);
        });
      });
    });

    it("should display 'no results' message when no users match search", () => {
      const randomName = "xyzRandomName123";

      usersPage.searchUser(randomName);
      cy.url().should("include", `/list_users.php?search=${randomName}`);

      usersPage.verifySearchResults(randomName, false, 0);
      cy.contains(/no results|no users|not found/i).should("be.visible");
    });
  });
});
