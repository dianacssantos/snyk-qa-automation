import homePage from "../pages/homePage";
import basicLogin from "../pages/basicLogin";
import usersPage from "../pages/usersPage";

/**
 * This test suite intends to user management tests:
1. User List Display:
○ List users work properly (users loaded, expected fields present)

2. Search Functionality 
○ Results are as expected for existing users (search full or partial)
○ Results are as expected for non existing users, or empty searches
 */

describe("User List and Search Functionality", () => {
  const { username, password } = Cypress.env("valid_basic_login");

  beforeEach(() => {
    cy.loginBasic(username, password);
    usersPage.listUsersAndAssert("list_users");
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
          usersPage.verifySearchUrl(name);
          usersPage.verifySearchResults(name, true, expectedMatches);
        });
      });
    });

    it("should validate partial name searches", () => {
      cy.fixture("searchTerms").then(({ partialSearchTerms }) => {
        partialSearchTerms.forEach(({ name, expectedMatches, description }) => {
          cy.log(`🔍 [Partial Search] "${name}" — ${description}`);

          usersPage.searchUser(name);
          usersPage.verifySearchResultText(name);
          usersPage.verifySearchUrl(name);
          usersPage.verifySearchResults(name, false, expectedMatches);
        });
      });
    });

    it("should display 'no results' message when no users match search", () => {
      const randomName = usersPage.generateFakeFullName();
      usersPage.searchUser(randomName);
      usersPage.verifySearchUrl(randomName);
      usersPage.verifySearchResults(randomName, false, 0);
      usersPage.assertNoResultsMessage();
    });
  });
});
