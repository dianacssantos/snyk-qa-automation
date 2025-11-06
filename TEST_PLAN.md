# TEST_PLAN.md

## Framework Choice
**Framework:** Cypress (JavaScript)  
**Rationale:** Cypress was chosen for its fast setup, modern API, and excellent documentation. It enables reliable end-to-end UI testing and smooth integration with test data.

## High Level Test Strategy
- **Test Structure: Page Object Model (POM)**

  - Each page in the application will have its own class containing **selectors** for UI elements and **methods** to perform actions. This structure improves readability, reusability, and maintainability of the tests.

  - **Test Data:**
  - Static data stored in `cypress/fixtures/*.json`
  - Sensitive data (valid credentials) stored in `cypress.env.json`

- **Setup & Teardown:**
  - **Before each test:**  
    - Navigate to the base URL
    - Clear cookies, sessions, and local storage to ensure isolation  
  - **After each test:** 
    - Session is cleared with beforeEach, so no need for afterEach here
  - **On test failure:** 
    - Automatic screenshots for debugging

- **Execution Strategy:**
  - Tests grouped by functionality (authentication, user management)
  - Independent test execution

## 3. Test Cases

### Login Tests
## Test Cases List

### Authentication Tests
| ID | Test Case Description | Expected Result |
|----|----------------------|----------------------|
| AUTH-01 | Successful login with valid credentials | Redirected to users list page, user authenticated |
| AUTH-02 | Login with invalid password | Error message shown 'Invalid username or password', remains on login page |
| AUTH-03 | Login with non-registered username | Error message shown 'Invalid username or password' |
| AUTH-04 | Login with empty fields | Validation messages shown, login prevented |
| AUTH-05 | Invalid username format validation | Error messahe shown 'Enter a valid username', login prevented |
| AUTH-06 | Session persistence after browser restart | User remains logged in, no re-authentication needed |


### User Listing / Search Tests
| ID | Test Case | Description | Expected Result |
|----|------------|--------------|-----------------|
| U1 | User list loads | User list appears post-login | At least one user displayed |
| U2 | Verify table columns headers | Validate the content of user details available | Check "Name", "Email" and "Role" are the fields available |
| U3 | Search existing user | Search full name of an existing user | Matching user displayed along with his details|
| U4 | Search partial | Partial name search | All containing names displayed |
| U5 | Search no results | Search for random string | No results are displayed on table |


## Test Cases Details

### Authentication Tests

| Test ID | Test Case | Steps | Expected Results |
|---------|-----------|-------|------------------|
| **AUTH-01** | Successful login with valid credentials | 1. Navigate to Cova-dev homepage<br>2. Click "Login!" button<br>3. Enter valid username<br>4. Enter valid password<br>5. Click "Login" button | 1. Page loads with login options visible<br>2. Redirected to login form with username/password fields<br>3. Username field populated<br>4. Password field populated (masked)<br>5. Redirected to users list page, correct user authenticated, no errors |
| **AUTH-02** | Login with invalid password | 1. Navigate to Cova-dev homepage<br>2. Click "Login!" button<br>3. Enter valid username<br>4. Enter invalid password<br>5. Click "Login" button | 1. Homepage loads successfully<br>2. Login form displayed with input fields<br>3. Username field populated<br>4. Password field populated (masked)<br>5. Error message "Invalid username or password" displayed, remains on login page |
| **AUTH-03** | Login with non-registered username | 1. Navigate to Cova-dev homepage<br>2. Click "Login!" button<br>3. Enter non-existent username<br>4. Enter any password<br>5. Click "Login" button | 1. Homepage loads successfully<br>2. Login form displayed<br>3. Username field populated<br>4. Password field populated<br>5. Error message "Invalid username or password" displayed |
| **AUTH-04** | Login with empty fields | 1. Navigate to Cova-dev homepage<br>2. Click "Login!" button<br>3. Leave username field empty<br>4. Leave password field empty<br>5. Click "Login" button | 1. Homepage loads successfully<br>2. Login form displayed<br>3. Username field remains empty<br>4. Password field remains empty<br>5. Validation messages "Username is required" and "Password is required" displayed |
| **AUTH-05** | Invalid username format validation | 1. Navigate to Cova-dev homepage<br>2. Click "Login!" button<br>3. Enter invalid username format<br>4. Enter any password<br>5. Click "Login" button | 1. Homepage loads successfully<br>2. Login form displayed<br>3. Invalid username format entered<br>4. Password field populated<br>5. Validation message "Enter a valid username" displayed, login prevented |
| **AUTH-06** | Session persistence after browser restart | 1. Login successfully<br>2. Close browser completely<br>3. Reopen browser and navigate to app URL<br>4. Check current page | 1. User authenticated and on users list page<br>2. Browser session closed<br>3. Application reloaded in new session<br>4. User remains logged in, directly accesses users list page |

### User Listing / Search Tests

| Test ID | Test Case | Steps | Expected Results |
|---------|-----------|-------|------------------|
| **USER-01** | User list loads | 1. Login successfully<br>2. Navigate to users list page | 1. User authenticated<br>2. Users list/page loads completely, at least one user record displayed, no loading errors |
| **USER-02** | Verify table columns headers | 1. Access users list page<br>2. Inspect table headers | 1. Users list displayed<br>2. "Name", "Email", and "Role" column headers displayed, all expected columns present |
| **USER-03** | Search existing user | 1. Access users list page<br>2. Identify existing user name from list<br>3. Enter full name in search field<br>4. Execute search | 1. Users list displayed with multiple users<br>2. Target user name identified<br>3. Search field populated with full name<br>4. Only matching user displayed, search results show exactly 1 record, user details maintained and correct |
| **USER-04** | Search partial name | 1. Access users list page<br>2. Identify partial name fragment from existing users<br>3. Enter partial name in search field<br>4. Execute search | 1. Users list displayed<br>2. Partial name fragment identified<br>3. Search field populated with partial name<br>4. All users containing search term displayed, results count less than full list, each result contains search term in name field |
| **USER-05** | Search no results | 1. Access users list page<br>2. Enter random string in search field<br>3. Execute search | 1. Users list displayed<br>2. Search field populated with random string<br>3. No users displayed in table |


## 4. Notes

Recommended improvements:

### 4.1. Missing IDs, unique IDs and test-friendly selectors
Stable and unique identifiers are essential for reliable automation, but many elements currently rely on generic CSS classe, or reused IDs. This makes selectors fragile and hard to maintain.
**Recommendation:** Add dedicated attributes for automation (e.g., data-testid), and ensure IDs are unique per component or context.

### 4.2. Duplicated login page structures
The application provides multiple login options, like basic, 2FA, Email-based 2FA, or CAPTCHA (all implmemented as separate pages).
This creates code duplication and extra effort to maintain separate Page Objects for the same interactions, being also more prone to inconsitencies and more confusing.
**Recomendation:** Consolidate login functionality into a single, configurable component. 

### 4.3. Inconsistent Validation and Error Message Structures
Validation messages differ across login types — some rely on browser-native tooltips, others use Bootstrap alert boxes. This inconsistency makes assertion logic complex and less reliable.
**Recommendation:** Introduce a reusable, standardized error component that wraps all validation and API-level errors in a consistent structure.

### 4.4. External login options are inconsistent and confusing
There are multiple options to login externally, on main login page we have Auth0 and Google, but only inside Auth0 authentication usign "Continue with Google" the user is really able to login with google account.
This creates confusion and complicates end-to-end testing, as different entry points behave inconsistently.
**Recommendation:** All external authentication should be gathered on the unified login page (mentioned on 4.2), and clearly remove or fix non-functional buttons.

### 4.5. CAPTCHA should have a test-friendly bypass
End-to-end automation can be difficult using CAPTCHA mechanisms, designed to prevent automation.
**Recommendation:**  
Provide a testing environment with disabled CAPTCHA, or user that don't require CAPTCHA verification.