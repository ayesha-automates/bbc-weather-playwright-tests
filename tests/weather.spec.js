const { test, expect } = require('@playwright/test');

test('search for Manchester weather', async ({ page }) => {
  await page.goto('https://www.bbc.co.uk/weather');

  const searchBox = page.getByRole('combobox', {
    name: 'Enter a town, city or UK'
  });

  await searchBox.fill('Manchester');

 await searchBox.press('Enter');

 await page.getByRole('link', {
    name: 'Manchester Airport, Manchester'
  }).click();

  await expect(
    page.getByRole('heading', { name: /Manchester/i }).first()
  ).toBeVisible();

 const weatherSummary = page.getByText(
    /sunny|cloudy|rain|clear|mist|fog|snow|thunder|drizzle|overcast|showers/i
  )
  .filter({ visible: true })
  .first();

  await expect(weatherSummary).toBeVisible({ timeout: 10000 });
});