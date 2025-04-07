const { test, expect } = require('@playwright/test');

test('Invalid Search Test', async ({ page }) => {
  // Go to the Yellow Pages website
  await page.goto('https://www.yellowpages.ca');
  
  

  // Now proceed with the search form after cookies are accepted
  await page.fill('input[id="whatwho"]', 'asldkfjalsdfkj');
  await page.fill('input[id="where"]', 'Montreal, QC');
  await page.click('button[type="submit"]');
  
  // Wait for some time for results to load
  await page.waitForTimeout(5000);

  // Check if no listings are found
  const listingsCount = await page.locator('.listing').count();
  
  // Check if "No results found" message is visible
  const noResultsMessage = await page.locator('text="No results found"').isVisible().catch(() => false);

  // Assert that either no listings are present or "No results found" message is visible
  expect(listingsCount === 0 || noResultsMessage).toBeTruthy();
});
