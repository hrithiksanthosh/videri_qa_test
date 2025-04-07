const { test, expect } = require('@playwright/test');
const fs = require('fs');  // Import the fs module to read files
const path = require('path'); // Import path to easily reference files

// Load test data from the 'data' folder
const positiveTestData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'positiveTestData.json')));
const negativeTestData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'negativeTestData.json')));
const symbolTestData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'symbolTestData.json')));

const DEFAULT_TIMEOUT = 15000;  // Set a default timeout for selectors

// Function to handle page load errors
async function navigateToPage(page, url, timeout) {
  try {
    await page.goto(url, { timeout });
    // Optionally, wait for a key element to confirm the page is fully loaded
    await page.waitForSelector('input[id="whatwho"]', { timeout });
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.error(`Page load failed: Timeout exceeded while loading ${url}`);
    } else {
      console.error(`Page load failed: ${error.message}`);
    }
    throw error;  // Re-throw the error to fail the test
  }
}

test.describe('Search Functionality - Positive Tests', () => {
  positiveTestData.forEach(({ what, where, expectedKeyword }) => {
    test(`Should return results for "${what}" in "${where}"`, async ({ page }) => {
      await navigateToPage(page, 'https://www.yellowpages.ca', DEFAULT_TIMEOUT);  // Use the helper function

      try {
        await page.fill('input[id="whatwho"]', what);
        await page.fill('input[id="where"]', where);
        await page.click('button[type="submit"]');

        // Wait for listings to appear with a specific timeout
        await page.waitForSelector('.listing', { timeout: DEFAULT_TIMEOUT }).catch(() => {});        
        const listings = await page.locator('.listing').allTextContents();

        // Handle case if no listings are returned
        expect(listings.length).toBeGreaterThan(0);
        expect(listings.some(text => text.toLowerCase().includes(expectedKeyword))).toBeTruthy();
      } catch (error) {
        throw new Error(`Positive Search Test failed for "${what} in ${where}": ${error.message}`);
      }
    });
  });
});

test.describe('Search Functionality - Negative Tests (No Results)', () => {
  negativeTestData.forEach(({ what, where }) => {
    test(`Should return 0 results for "${what}" in "${where}"`, async ({ page }) => {
      await navigateToPage(page, 'https://www.yellowpages.ca', DEFAULT_TIMEOUT);  // Use the helper function

      try {
        await page.fill('input[id="whatwho"]', what);
        await page.fill('input[id="where"]', where);
        await page.click('button[type="submit"]');

        // Wait for listings to load, catch timeout errors if any
        await page.waitForSelector('.listing', { timeout: DEFAULT_TIMEOUT }).catch(() => {});
        
        const listings = await page.locator('.listing').count();
        
        expect(listings).toBe(0);
      } catch (error) {
        throw new Error(`Negative Search Test failed for "${what} in ${where}": ${error.message}`);
      }
    });
  });
});

test.describe('Search Functionality - Symbol Input Tests', () => {
  symbolTestData.forEach(({ what, where }) => {
    test(`Should return 0 results for symbols "${what}" in "${where}"`, async ({ page }) => {
      await navigateToPage(page, 'https://www.yellowpages.ca', DEFAULT_TIMEOUT);  // Use the helper function

      try {
        await page.fill('input[id="whatwho"]', what);
        await page.fill('input[id="where"]', where);
        await page.click('button[type="submit"]');

        // Wait for listings to load, catch timeout errors if any
        await page.waitForSelector('.listing', { timeout: DEFAULT_TIMEOUT }).catch(() => {});
        
        const listings = await page.locator('.listing').count();

        expect(listings).toBe(0);
      } catch (error) {
        throw new Error(`Symbol Input Test failed for "${what} in ${where}": ${error.message}`);
      }
    });
  });
});

test('Search Functionality Test - Verify Suggestions', async ({ page }) => {
  await navigateToPage(page, 'https://www.yellowpages.ca', DEFAULT_TIMEOUT);  // Use the helper function

  try {
    await page.fill('input[id="whatwho"]', 'Pizza');

    // Wait for suggestions dropdown to be visible
    const suggestionDropdown = page.locator('div.tt-dataset.tt-dataset-what');
    await suggestionDropdown.waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT });

    const suggestions = await suggestionDropdown.locator('div.tt-suggestion.tt-selectable').allTextContents();

    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some(suggestion => suggestion.toLowerCase().includes('pizza'))).toBeTruthy();
  } catch (error) {
    throw new Error(`Suggestion Verification Test failed: ${error.message}`);
  }
});
