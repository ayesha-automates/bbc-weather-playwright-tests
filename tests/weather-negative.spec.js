
const { test, expect } = require('@playwright/test');

test('invalid weather location is handled safely', async ({ page }) => {
  const invalidUrl =
    'https://www.bbc.co.uk/weather/999999999999';

  const response = await page.goto(invalidUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });

  expect(response).not.toBeNull();

  // The website should not return a server error.
  expect(response.status()).toBeLessThan(500);

  const pageText = await page.locator('body').innerText();

  const redirectedToWeatherHome =
    /^https:\/\/www\.bbc\.co\.uk\/weather\/?$/.test(page.url());

  const errorMessageShown =
    /not found|couldn't find|cannot find|try searching|weather location/i.test(
      pageText
    );

  const visibleTemperatureCount = await page
    .getByText(/-?\d+°/)
    .filter({ visible: true })
    .count();

  // Invalid input should redirect, show an error,
  // or display no valid weather forecast.
  expect(
    redirectedToWeatherHome ||
      errorMessageShown ||
      visibleTemperatureCount === 0
  ).toBeTruthy();
});
