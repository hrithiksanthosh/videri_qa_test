const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.yellowpages.ca');

  const acceptBtn = page.locator('#onetrust-accept-btn-handler');
  try {
    await acceptBtn.waitFor({ state: 'visible', timeout: 5000 });
    await acceptBtn.click();
    await page.waitForSelector('#onetrust-accept-btn-handler', { state: 'detached' });
    await page.waitForSelector('.onetrust-pc-dark-filter', { state: 'detached' });
  } catch (e) {
    console.log('Cookie banner not shown, continuing...');
  }

  // Save storage state to a file
  await page.context().storageState({ path: 'storage/cookies.json' });
  await browser.close();
})();
