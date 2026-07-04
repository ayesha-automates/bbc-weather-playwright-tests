const { test, expect } = require('@playwright/test');
const { WeatherPage } = require('../pages/WeatherPage');

const cities = [
  { name: 'Manchester', id: '2643123' },
  { name: 'London', id: '2643743' },
  { name: 'Birmingham', id: '2655603' },
  { name: 'Liverpool', id: '2644210' },
];

for (const city of cities) {
  test(`${city.name} weather forecast is displayed`, async ({ page }) => {
    const weatherPage = new WeatherPage(page);

    const response = await weatherPage.openCity(city.id);

    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(400);

    await expect(
      weatherPage.locationHeading(city.name)
    ).toBeVisible();

    await expect(
      weatherPage.temperature()
    ).toBeVisible();
  });
}