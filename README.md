# snyk-qa-automation

##  Snyk Cova Automated Tests
This repository contains E2E automated tests for **login** and **user management** functionalities of **Cova** application.

## Project Structure

```
snyk-qa-automation/
├── cypress/
├── README.md                                 # How to start
├── TEST_PLAN.md                              # Detailed test plan
│   ├── e2e/
│   │   ├── login/
│   │   │   └── login.cy.js                   # Login tests
│   │   └── user-management/
│   │       └── user-search.cy.js             # User management tests
│   ├── fixtures/
│   │   └── credentials.json                  # Test data
│   ├── pages/                                # Page Object Model files
│   │   ├── loginPage.js
│   │   └── userListPage.js
│   └── support/
│       ├── commands.js                       # Custom Cypress commands
│       └── e2e.js                            # Test setup/config
├── cypress.config.js                          # Cypress configuration file
├── cypress.env.json                           # Environment variables (e.g., credentials)
└── package.json                               # Project dependencies and scripts
```

## Setup 
### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

## Start Testing

- Clone repository
```bash
git clone git@github.com:dianacssantos/snyk-qa-automation.git
cd snyk-qa-automation
```

- Install dependencies
```bash
npm install
```
- Configure environment variables
Copy the example environment file and update it with your credentials:
```bash
cp cypress.env.example.json cypress.env.json
```
- Run tests (Cypress GUI)
```bash
npx cypress open
```
- Run tests (Headless)
```bash
npx cypress run
```