# Videri Software QA Automation Tests

This project contains **automated UI tests** for the [Yellow Pages Canada](https://www.yellowpages.ca) website using [Playwright](https://playwright.dev) and JavaScript (Node.js). The automated tests cover various user interactions like business search, filtering results, and validating page content.

---

## Test Scenarios Covered

### Automated UI Test Cases

The following test scenarios have been automated using Playwright:

1. **Searching for a Business**

   - Automates searching for common terms like "Pizza" in specific locations.

2. **Applying Filters to Search Results**

   - Applies filters (e.g., open now, ratings) and verifies the updated result set.

3. **Validating Search Results**

   - Validates that the search results contain the expected business types and content.

4. **Invalid Search Test**
   - Inputs uncommon terms like "Unicorn" or symbols (`#`, `$$`) and validates graceful error or empty states.

All these tests are written using a **data-driven testing approach** for easy scaling and variation.

---

## Project Structure

```
videri_qa_test/
├── tests/
│   ├── search.test.js               # Test: Searching for a business
│   ├── filterResults.test.js        # Test: Applying filters to search results
│   ├── validateResults.test.js      # Test: Validating search result content
│   ├── invalidSearch.test.js        # Test: Invalid/edge case search scenarios
├── test/data/
│   ├── negativeTestData.json        # Positive, negative, and symbol test data
│   ├── positiveTestData.json
│   ├── symbolTestData.json
├── test-results/
│   ├── videos/
│   └── traces/
├── storage/
│   └── cookies.json                 # Session storage for authenticated/consented state
├── accept-cookies-setup.js          # Script to save session cookies
├── playwright.config.cjs            # Playwright configuration file
├── package.json                     # Node.js dependencies and test scripts
└── README.md                        # This file
```

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or above)
- npm (comes with Node.js)
- [Visual Studio Code](https://code.visualstudio.com/) (optional but recommended)

---

## Get the Project

### Option 1: Clone from Git

```bash
git clone https://github.com/your-username/videri_qa_test.git
cd videri_qa_test
```

### Option 2: Open in Visual Studio Code

1. Launch Visual Studio Code
2. Go to **File > Open Folder...**
3. Select the project directory
4. Use the integrated terminal (`Ctrl + ``) to run commands

---

## Installation

1. **Install dependencies**

```bash
npm install
```

2. **Install Playwright browsers**

```bash
npx playwright install
```

---

## Setting Up Cookies

Before running the tests, initialize the cookie storage by running:

```bash
node setup/accept-cookies-setup.js
```

This creates: `storage/cookies.json`

---

## Running the Tests

Execute all automated tests:

```bash
npx playwright test
```

Run in headed mode (with visible browser):

```bash
npx playwright test --headed
```

---

## Parallel Execution

Tests run in parallel using **4 workers**, configured in `playwright.config.cjs`:

```js
workers: 4;
```

---

## Session, Video & Trace Storage

- Cookies/session state: `storage/cookies.json`
- Videos: `test-results/videos/`
- Traces: `test-results/traces/`

---

## Data-Driven Testing

Each test uses data sets defined in `test/data/`:

- `searchData.js`: Common and uncommon business searches
- `filterData.js`: Various filter options
- `validationKeywords.js`: Keywords for result verification
- `invalidInputs.js`: Invalid and special character inputs

These make it easy to scale and maintain different user interaction test cases.

---

## Exception Handling

Custom handling is added for:

- Page not loaded properly
- Elements missing due to load delays

Appropriate error messages and fallback logic is included to prevent crashes.

---

## View Reports

To open the test report after execution:

```bash
npx playwright show-report
```
