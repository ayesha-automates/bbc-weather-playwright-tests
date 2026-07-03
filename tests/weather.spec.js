

const { test, expect } = require('@playwright/test');

const MANCHESTER_URL = 'https://www.bbc.co.uk/weather/2643123';

test('Manchester weather forecast is displayed', async ({ page }) => {
  test.setTimeout(60000);

  // Open the Manchester forecast directly.
  const response = await page.goto(MANCHESTER_URL, {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });

  // Confirm that BBC returned a successful page.
  expect(response, 'BBC Weather returned no response').not.toBeNull();

  expect(
    response.status(),
    `BBC Weather returned HTTP status ${response.status()}`
  ).toBeLessThan(400);

  // Confirm that the correct Manchester URL opened.
  await expect(page).toHaveURL(
    /\/weather\/2643123(?:[/?#]|$)/
  );

  // Confirm that this is a BBC Weather Manchester page.
  await expect(page).toHaveTitle(
    /Manchester.*BBC Weather|BBC Weather.*Manchester/i
  );

  // Confirm that Manchester is shown on the page.
  const locationHeading = page
    .getByRole('heading', { name: /Manchester/i })
    .first();

  await expect(locationHeading).toBeVisible({
    timeout: 20000,
  });

  // Confirm that a visible temperature is displayed.
  const temperature = page
    .getByText(/-?\d+°/)
    .filter({ visible: true })
    .first();

  await expect(temperature).toBeVisible({
    timeout: 20000,
  });

  // Confirm that a visible weather description is displayed.
  const weatherSummary = page
    .getByText(
      /\b(sunny|cloud|rain|clear|mist|fog|snow|thunder|drizzle|overcast|shower|sleet|hail)\b/i
    )
    .filter({ visible: true })
    .first();

  await expect(weatherSummary).toBeVisible({
    timeout: 20000,
  });
});