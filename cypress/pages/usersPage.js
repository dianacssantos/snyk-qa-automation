class UsersPage {
  elements = {
    listUsersMenu: () => cy.contains("a.nav-link", "List Users"),
    listUsersTitle: () => cy.contains("#admin_page"),
    searchTextbox: () => cy.get('form.d-none.d-sm-inline-block input[name="search"]'),
    searchButton: () => cy.get('button.btn.btn-primary[type="submit"]'),
    usersTable: () => cy.get("#dataTable"),
    tableHeaders: () => cy.get("table thead th"),
    userRows: () => cy.get("table tbody tr"),
    resultsText: () => cy.contains("p", "Search results for:"),
  };

  listUsers() {
    this.elements.listUsersMenu().click();
  }

  searchUser(name) {
    if (name) {
      this.elements.searchTextbox().clear().type(name);
    }
    this.elements.searchButton().click();
  }

  countRows() {
    return this.elements.userRows().then(($rows) => $rows.length);
  }

  verifyHeaders(expected = ["name", "age", "start date", "salary"]) {
    this.elements.tableHeaders().then(($headers) => {
      const headerTexts = [...$headers].map((h) =>
        h.innerText.trim().toLowerCase().replace(/\s+/g, " ")
      );

      expected.forEach((expectedHeader) => {
        expect(
          headerTexts.some((header) => header.includes(expectedHeader)),
          `Expected table to contain header: ${expectedHeader}`
        ).to.be.true;
      });
    });
  }

  getRandomUserRow() {
    return this.elements
      .userRows()
      .should("have.length.greaterThan", 0)
      .then(($rows) => {
        const total = $rows.length;
        const randomIndex = Math.floor(Math.random() * total);
        cy.log(`Selected random user row #${randomIndex + 1} of ${total}`);
        return cy.wrap($rows[randomIndex]);
      });
  }

  verifySearchResultText(term) {
    if (term.trim() === "") {
      cy.log("Search results for: (empty term)");
      return;
    }

    this.elements
      .resultsText()
      .should("be.visible")
      .within(() => {
        cy.get("b")
          .invoke("text")
          .then((text) => text.trim())
          .should("eq", term, `"Search results for:" include term"`);
      });
  }

  verifyUserRowStructure($row) {
    cy.wrap($row).within(() => {
      // Name
      cy.get("td")
        .eq(0)
        .invoke("text")
        .then((t) => t.trim())
        .should(
          "match",
          /^[A-Za-z\s]+$/,
          "Name should contain only letters and spaces"
        );

      // Age
      cy.get("td")
        .eq(1)
        .invoke("text")
        .then((t) => t.trim())
        .should("match", /^\d{1,3}$/, "Age should be 1-3 digits");

      // Start Date
      cy.get("td")
        .eq(2)
        .invoke("text")
        .then((t) => t.trim())
        .should("match", /^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

      // Salary
      cy.get("td")
        .eq(3)
        .invoke("text")
        .then((t) => t.trim().replace(/[^0-9]/g, ""))
        .should("match", /^\d{1,8}$/, "Salary should be 1-100000000");
    });
  }

  verifyRandomUserRowStructure() {
    this.getRandomUserRow().then(($row) => {
      this.verifyUserRowStructure($row);
    });
  }

  getUserFullName($row) {
    return cy
      .wrap($row)
      .find("td")
      .eq(0)
      .invoke("text")
      .then((text) => text.trim());
  }

  verifySearchResults(searchTerm, exact = false, expectedMatches) {
    const searchLower = searchTerm.trim().toLowerCase();
    const validationLimit = 3; // checking max of 3 results to validate

    cy.get("table tbody", { timeout: 10000 }).then(($tbody) => {
      const $rows = $tbody.find("tr");
      const rowCount = $rows.length;

      cy.log(`Found ${rowCount} rows for "${searchTerm}"`);
      expect(
        rowCount,
        `Expected ${expectedMatches} results for "${searchTerm}"`
      ).to.eq(expectedMatches);

      if (rowCount === 0) {
        cy.log("No rows found — empty table, as expected");
        return;
      }

      if (!searchLower) {
        cy.log("Empty search — skipping content validation.");
        return;
      }

      const rowsToCheck = Math.min(validationLimit, rowCount);
      cy.log(
        `Validating ${rowsToCheck} of ${rowCount} rows for "${searchLower}"`
      );

      for (let i = 0; i < rowsToCheck; i++) {
        cy.wrap($rows[i])
          .find("td:first")
          .invoke("text")
          .then((name) => {
            name = name.trim().toLowerCase();

            if (exact) {
              expect(name).to.eq(
                searchLower,
                `Expected exact match for "${searchLower}"`
              );
            } else {
              expect(name).to.include(
                searchLower,
                `Expected partial match for "${searchLower}"`
              );
            }

            cy.log(`Row ${i + 1}: "${name}" matches "${searchLower}"`);
          });
      }

      if (rowCount > validationLimit) {
        cy.log(
          `Skipped validation for remaining ${rowCount - validationLimit} rows`
        );
      }
    });
  }
}
export default new UsersPage();
