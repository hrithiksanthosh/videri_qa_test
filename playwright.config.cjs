const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 30000,
  workers: 4, // Enables parallel execution with 4 worker threads
  use: {
    headless: false,  // Set to true if you don't need UI
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'on',
    storageState: 'storage/cookies.json',
    videoDir: 'test-results/videos',
    traceDir: 'test-results/traces',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ]
});
