import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail CI if test.only is accidentally left in the code
  forbidOnly: !!process.env.CI,

  // Retry failed tests twice on GitHub Actions
  retries: process.env.CI ? 2 : 0,

  // Use one worker on GitHub Actions
  workers: process.env.CI ? 1 : undefined,

  // Create an HTML report
  reporter: 'html',

  // Shared settings for every browser
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Run tests in three browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});