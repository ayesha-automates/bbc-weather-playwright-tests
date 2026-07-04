class WeatherPage {
  constructor(page) {
    this.page = page;
  }

  async openCity(cityId) {
    return await this.page.goto(
      `https://www.bbc.co.uk/weather/${cityId}`,
      {
        waitUntil: 'domcontentloaded',
        timeout: 45000,
      }
    );
  }

  locationHeading(cityName) {
      return this.page
        .getByRole('heading', {
          name: new RegExp(cityName, 'i'),
        })
        .first();
    }
  
    temperature() {
      return this.page
        .getByText(/-?\d+°/)
        .filter({ visible: true })
        .first();
    }
  
    weatherSummary() {
      return this.page
        .getByText(
          /\b(sunny|cloud|rain|clear|mist|fog|snow|thunder|drizzle|overcast|shower|sleet|hail)\b/i
        )
        .filter({ visible: true })
        .first();
    }
  }
  
  module.exports = { WeatherPage }; 