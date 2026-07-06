const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test(
  'Manchester weather page has no unexpected serious accessibility issues',
  async ({ page }) => {
    await page.goto('https://www.bbc.co.uk/weather/2643123', {
      waitUntil: 'domcontentloaded',
    });

    await expect(
      page.getByRole('heading', { name: /Manchester/i }).first()
    ).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const seriousIssues = results.violations.filter(
      issue =>
        issue.impact === 'serious' ||
        issue.impact === 'critical'
    );

    // Known BBC Weather accessibility issue:
    // Search combobox is missing aria-expanded and aria-controls.
    const unexpectedIssues = seriousIssues.filter(issue => {
      const isKnownRule = issue.id === 'aria-required-attr';

      const affectsKnownSearchBox = issue.nodes.every(node =>
        node.target.some(target =>
          String(target).includes('.ls-c-search__container')
        )
      );

      return !(isKnownRule && affectsKnownSearchBox);
    });

    console.log(
      'Known accessibility issues:',
      seriousIssues.filter(issue =>
        issue.id === 'aria-required-attr'
      )
    );

    expect(
      unexpectedIssues,
      JSON.stringify(unexpectedIssues, null, 2)
    ).toEqual([]);
  }
);