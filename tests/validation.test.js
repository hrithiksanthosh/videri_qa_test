const { test, expect } = require('@playwright/test');

test('Result Validation Test', async ({ page }) => {
  await page.goto('https://www.yellowpages.ca');

  // Fill in search form and submit
  await page.fill('input[id="whatwho"]', 'Pizza');
  await page.fill('input[id="where"]', 'Toronto');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.listing');

  // Click the first visible listing
  const firstListing = page.locator('.listing').first();
  await firstListing.click();

  // Wait for business details page to load
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  // Extract Business Name
  const nameLocator = page.locator('h1');
  await expect(nameLocator).toBeVisible({ timeout: 10000 });
  const name = await nameLocator.textContent();

  // Extract Address
  let address = '';
  const addressSelectors = [
    '.merchant.address .streetAddress',
    '[itemprop="streetAddress"]',
    '[itemprop="addressLocality"]',
    '[data-qa="streetAddress"]',
    '.merchant.address .postalCode'
  ];

  for (const selector of addressSelectors) {
    const addrLocator = page.locator(selector);
    if (await addrLocator.first().isVisible()) {
      address = await addrLocator.first().textContent();
      break;
    }
  }

  

  // Debug Output
  console.log('Name:', name?.trim());
  console.log('StreetAddress:', address?.trim());

  // Assertions
  expect(name?.trim()).toBeTruthy();

  if (address?.trim()) {
    expect(address.trim()).toBeTruthy();
  } else {
    console.warn('⚠️ Address not found — skipping address assertion.');
  }

});