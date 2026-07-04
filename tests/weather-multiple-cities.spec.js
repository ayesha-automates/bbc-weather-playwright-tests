const { test, expect } = require('@playwright/test');
const { WeatherPage } = require('../pages/WeatherPage');
const { cities } = require('../test-data/cities');

for (const city of cities) {
  test(`${city.name} weather forecast is displayed`, async ({ page }) => {
    const weatherPage = new WeatherPage(page);

    const response = await weatherPage.openCity(city.id);

    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(400);

    await expect(page).toHaveURL(
      new RegExp(`/weather/${city.id}`)
    );

    await expect(page).toHaveTitle(
      new RegExp(`${city.name}.*BBC Weather|BBC Weather.*${city.name}`, 'i')
    );

    await expect(
      weatherPage.locationHeading(city.name)
    ).toBeVisible();

    await expect(
      weatherPage.temperature()
    ).toBeVisible();

    await expect(
      weatherPage.weatherSummary()
    ).toBeVisible();
  });
}