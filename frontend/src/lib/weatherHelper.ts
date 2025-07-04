const BASE_URL = "http://api.weatherapi.com/v1";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export function createCurrentUrl(location: string): string {
  return `${BASE_URL}/current.json?key=${API_KEY}&q=${location}&aqi=yes`;
}

export function createForecastUrl(days: number, location: string): string {
  return `${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=${days}&aqi=no`;
}

export function createAstroUrl(location: string, date: string): string {
  return `${BASE_URL}/astronomy.json?key=${API_KEY}&q=${location}&dt=${date}`;
}

export function createHistoricalUrl(start_date: string, end_date: string): string {
  return `${BASE_URL}/history.json?key=${API_KEY}&q=${location}&start_date=${start_date}&end_date=${end_date}`;
}
