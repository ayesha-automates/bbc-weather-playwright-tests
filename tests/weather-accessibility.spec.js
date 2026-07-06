const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test(
  'Manchester weather page accessibility audit',
  async ({ page, browserName }) => {
    // Run Axe once in Chromium.
    // Your normal tests already cover Firefox and WebKit.
    test.skip(
      browserName !== 'chromium',
      'Accessibility audit runs only in Chromium'
    );

    await page.goto('https://www.bbc.co.uk/weather/2643123', {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });

    await expect(
      page.getByRole('heading', { name: /Manchester/i }).first()
    ).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      // Exclude BBC's known broken search combobox.
      .exclude('.ls-c-search__container')
      .analyze();

    const seriousIssues = results.violations.filter(
      issue =>
        issue.impact === 'serious' ||
        issue.impact === 'critical'
    );

    expect(
      seriousIssues,
      JSON.stringify(seriousIssues, null, 2)
    ).toEqual([]);
  }
);