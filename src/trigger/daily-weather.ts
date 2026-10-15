
import { task } from "@trigger.dev/sdk";

type WeatherForecast = {
  city: string;
  dateTimeUtc: string;
  temperatureC: number;
  humidity: number;
  description: string;
};

export const dailyWeatherTask = task({
  id: "daily-calgary-weather",

  run: async (): Promise<WeatherForecast> => {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      throw new Error("OPENWEATHER_API_KEY is missing");
    }

    const params = new URLSearchParams({
      q: "Calgary,CA",
      appid: apiKey,
      units: "metric",
    });

    const url =
      `https://api.openweathermap.org/data/2.5/forecast?${params}`;

    const response = await fetch(url);

    if (response.status === 429) {
      throw new Error("OpenWeatherMap rate limit reached");
    }

    if (!response.ok) {
      throw new Error(
        `Weather API failed with HTTP ${response.status}`
      );
    }

    const data = await response.json();

    const forecast = data.list?.[0];

    if (!forecast || !data.city?.name) {
      throw new Error("Weather API returned incomplete forecast data");
    }

    const result: WeatherForecast = {
      city: data.city.name,
      dateTimeUtc: forecast.dt_txt,
      temperatureC: forecast.main.temp,
      humidity: forecast.main.humidity,
      description: forecast.weather?.[0]?.description ?? "Unknown",
    };

    console.log("Calgary forecast retrieved:", result);

    return result;
  },
});
