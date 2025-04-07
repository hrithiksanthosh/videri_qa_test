const { test, expect } = require('@playwright/test');

// Define test data
const searchData = [
  { what: 'Pizza', where: 'Montreal, QC' },
  { what: 'Sushi', where: 'Toronto, ON' }
];

// Function to handle page load errors with retries
async function navigateToPageWithRetry(page, url, timeout, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      attempt++;
      console.log(`Attempt ${attempt} to load page: ${url}`);

      // Attempt to navigate to the page
      await page.goto(url, { timeout });
      // Wait for an element to ensure the page has loaded
      await page.waitForSelector('input[id="whatwho"]', { timeout });
      console.log('Page loaded successfully');
      return; // Exit the function if successful
    } catch (error) {
      if (error.name === 'TimeoutError') {
        console.error(`Page load failed: Timeout exceeded while loading ${url}`);
      } else {
        console.error(`Page load failed: ${error.message}`);
      }

      if (attempt === retries) {
        console.error(`Failed to load page after ${retries} attempts.`);
        throw error; // Re-throw the error to fail the test
      }

      console.log(`Retrying... (${attempt}/${retries})`);
      await page.reload(); // Reload the page if a failure occurs
    }
  }
}

test.describe('Filter Results - Data-Driven Search with Open Now Filter', () => {
  searchData.forEach(({ what, where }) => {
    test(`Search for "${what}" in "${where}" with 'Open Now' filter`, async ({ page }) => {
      try {
        // Navigate to the page and handle load errors with retries
        await navigateToPageWithRetry(page, 'https://www.yellowpages.ca', 10000);

        // Fill search form
        await page.fill('input[id="whatwho"]', what);
        await page.fill('input[id="where"]', where);
        await page.click('button[type="submit"]');

        // Wait for results
        await page.waitForSelector('.listing', { timeout: 10000 }).catch(() => {});

        // Apply "Open Now" filter if available
        const filter = page.locator('text=Open Now');
        if (await filter.count() > 0) {
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'load', timeout: 10000 }).catch(() => {}),
            filter.first().click()
          ]);

          // Wait for listings to reappear
          await page.waitForSelector('.listing', { timeout: 5000 });

          // Validate filtered results are shown
          const listingsCount = await page.locator('.listing').count();
          expect(listingsCount).toBeGreaterThan(0);
        } else {
          console.warn(`"Open Now" filter not available for ${what} in ${where}.`);
        }
      } catch (error) {
        // Handle any error during test execution
        console.error(`Test failed for search: "${what}" in "${where}"`);
        throw error;
      }
    });
  });
});
