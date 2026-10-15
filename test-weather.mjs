
import "dotenv/config";

const apiKey = process.env.OPENWEATHER_API_KEY;

if (!apiKey) {
  throw new Error("OPENWEATHER_API_KEY is missing from .env");
}

const params = new URLSearchParams({
  q: "Calgary,CA",
  appid: apiKey,
  units: "metric",
});

const url = `https://api.openweathermap.org/data/2.5/forecast?${params}`;

const response = await fetch(url);

if (!response.ok) {
  const details = await response.text();
  throw new Error(
    `Weather API failed: HTTP ${response.status} - ${details}`
  );
}

const data = await response.json();

console.log("City:", data.city.name);
console.log("Country:", data.city.country);
console.log("Forecast entries:", data.list.length);

const first = data.list[0];

console.log("Forecast time (UTC):", first.dt_txt);
console.log("Temperature (°C):", first.main.temp);
console.log("Humidity (%):", first.main.humidity);
console.log("Description:", first.weather[0].description);
