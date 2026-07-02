const { test, expect } = require('@playwright/test');

test('search for Manchester weather', async ({ page }) => {
  test.setTimeout(90000);

  await page.goto('https://www.bbc.co.uk/weather', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());

  // Handle a consent button if BBC displays one
  const consentButton = page
    .getByRole('button', {
      name: /accept|agree|continue/i
    })
    .first();

  if (
    await consentButton
      .isVisible({ timeout: 5000 })
      .catch(() => false)
  ) {
    await consentButton.click();
  }

  // Flexible name instead of the complete exact wording
  const searchBox = page.getByRole('combobox', {
    name: /enter a town, city/i
  });

  await expect(searchBox).toBeVisible({ timeout: 30000 });
  await searchBox.fill('Manchester');
  await searchBox.press('Enter');

  const manchesterResult = page.getByRole('link', {
    name: /Manchester Airport, Manchester/i
  });

  await expect(manchesterResult).toBeVisible({
    timeout: 30000
  });

  await manchesterResult.click();

  await expect(
    page.getByRole('heading', { name: /Manchester/i }).first()
  ).toBeVisible();

  await expect(
    page.getByText(/\d+°/).filter({ visible: true }).first()
  ).toBeVisible();

  const weatherSummary = page
    .getByText(
      /sunny|cloudy|rain|clear|mist|fog|snow|thunder|drizzle|overcast|showers/i
    )
    .filter({ visible: true })
    .first();

  await expect(weatherSummary).toBeVisible({
    timeout: 10000
  });
});
