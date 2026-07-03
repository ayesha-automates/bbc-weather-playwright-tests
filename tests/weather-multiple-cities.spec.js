const { test, expect } = require('@playwright/test');

const cities = [
  { name: 'Manchester', id: '2643123' },
  { name: 'London', id: '2643743' },
  { name: 'Birmingham', id: '2655603' },
  { name: 'Liverpool', id: '2644210' },
];

for (const city of cities) {
  test(`${city.name} weather forecast is displayed`, async ({ page }) => {
    const url = `https://www.bbc.co.uk/weather/${city.id}`;

    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });

    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(400);

    await expect(page).toHaveURL(
      new RegExp(`/weather/${city.id}`)
    );

    await expect(
      page.getByRole('heading', { name: new RegExp(city.name, 'i') }).first()
    ).toBeVisible({ timeout: 20000 });

    await expect(
      page.getByText(/-?\d+°/).filter({ visible: true }).first()
    ).toBeVisible({ timeout: 20000 });
  });
}