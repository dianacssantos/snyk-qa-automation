# TEST_PLAN.md

## Framework Choice
**Framework:** Cypress (JavaScript)  
**Rationale:** Cypress was chosen for its fast setup, modern API, and excellent documentation. It enables reliable end-to-end UI testing and smooth integration with test data.

## High Level Test Strategy
**Test Structure: Page Object Model (POM)**

Each page in the application will have its own class containing **selectors** for UI elements and **methods** to perform actions. This structure improves readability, reusability, and maintainability of the tests.

**Test Data:**

- Static data stored in `cypress/fixtures/*.json`
- Sensitive data (valid credentials) stored in `cypress.env.json`

**Setup & Teardown:**
- **Before each test:** Login tests: Navigate to the homepage; User management tests: clear cookies, do a successfull login
- **After each test:** Session is cleared with beforeEach, so no need for afterEach here
- **On test failure:** Automatic screenshots for debugging

**Execution Strategy:** Tests grouped by functionality (login, user management) with independent test execution

## 3. High Level Test Cases

### Authentication Tests
| ID | Test Case Description | Expected Result |
|----|----------------------|----------------------|
| AUTH-01 | Successful login with valid credentials | Redirected to admin page, user authenticated |
| AUTH-02 | Login with wrong password | Error message shows "Wrong email or password", user remains on login page |
| AUTH-03 | Login with non-registered username/email | Error message shows "Wrong email or password", user remains on login page |
| AUTH-04 | Login with empty fields | Validation messages are displayed "Please fill in" / "Please enter an email address" / "Password is required", login prevented |
| AUTH-05 | Invalid email format validation | Error message is present, user remains on login page |
| AUTH-06 | Session persists successfully on app reload | User logged in automatically, no login page displayed, no errors|

### User Listing / Search Tests
| ID | Test Case Description | Expected Result |
|----|--------------------------|-----------------|
| USER-01 | User list loads after user clicks list users | At least one user displayed |
| USER-02 | User searches an existing user with full name | Matching user displayed along with his details|
| USER-03 | User searches an existing user with partial name | All containing names displayed |
| USER-04 | User searches a non matching user | "No results" message should be displayed |
| USER-05 | User clicks on search without specifing a name |  All user results are displayed on table |

## Test Cases Details
## Authentication Tests: Detailed per Login Page

| Test Case | Login Page | Steps | Expected Result |
|------------|-------------|--------|-----------------|
| **AUTH-01 Successful login with valid credentials** | **Login!** | 1. Navigate to homepage<br>2. Click "Login!" button<br>3. Enter a valid username and password<br>4. Click "Login" | Redirected to admin page, user authenticated successfully |
|  | **Auth0** | 1. Navigate to homepage<br>2. Click "Login!" button<br>3. Click "Login with Auth0" button<br>3. Enter valid email and password<br>4. Click "Continue" | Redirected to admin page, user authenticated successfully |
|
| **AUTH-02 Login with wrong password** | **Login!** | 1. Navigate to homepage<br>2. Click "Login!" button<br>3. Enter a valid username<br>4. Enter a wrong password<br>4. Click "Login" | Error message "Wrong username or password"; User remains on same page |
|  | **Auth0** | 1. Navigate to homepage<br>2. Click "Login!" button<br>3. Click "Login with Auth0" button<br>4. Enter valid email<br>5. Enter a wrong password | Error message "Wrong username or password"; User remains on same page |
|
| **AUTH-03 Login with non-registered username/email** | **Login!** | 1. Navigate to homepage<br>2. Click "Login!" button<br>3. Enter non-existent username<br>4. Enter any password<br>4. Click "Login" | Error message "Wrong username or password"; User remains on same page |
|  | **Auth0** | 1. Navigate to homepage<br>2. Click "Login!" button<br>3. Click "Login with Auth0" button<br>4. Enter valid but non registered email<br>5. Enter any password<br>6. Click "Continue"  | Error message "Wrong username or password"; User remains on same page |
|  | **Login 2FA Email** |  1. Navigate to homepage<br>2. Click "Login with 2FA using email!" button<br>3. Enter any valid(non registered) email<br>4. Enter any password<br>5. Click "Login" | Error message "Wrong username or password"; User remains on same page |
|
| **AUTH-04 Login with empty fields Empty fields validation** | **Login!** |  1. Navigate to homepage<br>2. Click "Login!" button<br>3. Leave username and password blank<br>4. Click "Login" | Browser validation message "Please fill in this field" is displayed; User remains on same page |
|  | **Auth0** | 1. Navigate to homepage<br>2. Click "Login!" button<br>3. Click "Login with Auth0" button<br>4. Leave both fields empty<br>5. Click "Continue" | Errors are displayed "Please enter an email address" and "Password is required"; User remains on same page |
|  | **Login 2FA Email** |1. Navigate to homepage<br>2. Click "Login with 2FA using email!" button<br>3. Leave both fields empty<br>4. Click "Login" | Browser validation message "Please fill in this field" is displayed; User remains on same page |
|
| **AUTH-05 Invalid email format validation** | **Auth0** | 1. Navigate to homepage<br>2. Click "Login!" button<br>3. Click "Login with Auth0" button<br>4. Enter malformed email<br>5. Enter any password<br>6. Click "Continue" | Error message "Wrong username or password"; User remains on same page |
|  | **Login 2FA Email** | 1. Navigate to homepage<br>2. Click "Login with 2FA using email!" button<br>3. Enter malformed email<br>4. Enter any password<br>5. Click "Login" | Validation messages prevent login; User remains on same page |
|


### User List and Search Tests

| Test Case | Steps | Expected Results |
|----------|--------|------------------|
| **USER-01 User list loads after user clicks list users** | 1. With a logged in user click on List users | Users List page loads correctly and displays a table with at least one user record, with fields "Name", "Age", "Start Date" and "Salary" filled |
| **USER-02 User searches an existing user with full name** | 1. With a logged in user click on List users<br>2. On search users box write an existing full name and click search icon| Table updates showing user(s) containing the exact searched full name, with its details filled|
| **USER-03 User searches an existing user with partial name** | 1. With a logged in user click on List users<br> 2. On search users box write a partial name common to 1 or more existing users | Table updates showing user(s) containing that partial name, with its details filled|
| **USER-04 User searches a non matching user** | 1. With a logged in user click on List users<br> On search users box write a random name | Table becomes empty with no results, and should show "No results"|
| **USER-05 User clicks on search without specifing a name** | 1. With a logged in user click on List users<br> 2. On search box click on search button | Table shows all users|
|
|

# 4. Notes
## Improvements that can be done:

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