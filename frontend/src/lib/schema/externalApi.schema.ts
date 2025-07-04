import { z } from "zod";

export const locationSchema = z.object({
  name: z.string(),
  region: z.string(),
  country: z.string(),
  lat: z.number(),
  lon: z.number(),
  tz_id: z.string(),
  localtime_epoch: z.number(),
  localtime: z.string(),
});

export const conditionSchema = z.object({
  text: z.string(),
  icon: z.string(),
  code: z.number(),
});

export const currentSchema = z.object({
  last_updated_epoch: z.number(),
  last_updated: z.string(),
  temp_c: z.number(),
  temp_f: z.number(),
  is_day: z.number(),
  condition: conditionSchema,
  wind_mph: z.number(),
  wind_kph: z.number(),
  wind_degree: z.number(),
  wind_dir: z.string(),
  pressure_mb: z.number(),
  pressure_in: z.number(),
  precip_mm: z.number(),
  precip_in: z.number(),
  humidity: z.number(),
  cloud: z.number(),
  feelslike_c: z.number(),
  feelslike_f: z.number(),
  windchill_c: z.number(),
  windchill_f: z.number(),
  heatindex_c: z.number(),
  heatindex_f: z.number(),
  dewpoint_c: z.number(),
  dewpoint_f: z.number(),
  vis_km: z.number(),
  vis_miles: z.number(),
  uv: z.number(),
  gust_mph: z.number(),
  gust_kph: z.number(),
  air_quality: z
    .object({
      co: z.number(),
      no2: z.number(),
      o3: z.number(),
      so2: z.number(),
      pm2_5: z.number(),
      pm10: z.number(),
      "us-epa-index": z.number(),
      "gb-defra-index": z.number(),
    })
    .optional(),
});

export const daySchema = z.object({
  maxtemp_c: z.number(),
  maxtemp_f: z.number(),
  mintemp_c: z.number(),
  mintemp_f: z.number(),
  avgtemp_c: z.number(),
  avgtemp_f: z.number(),
  maxwind_mph: z.number(),
  maxwind_kph: z.number(),
  totalprecip_mm: z.number(),
  totalprecip_in: z.number(),
  totalsnow_cm: z.number(),
  avgvis_km: z.number(),
  avgvis_miles: z.number(),
  avghumidity: z.number(),
  daily_will_it_rain: z.number(),
  daily_chance_of_rain: z.number(),
  daily_will_it_snow: z.number(),
  daily_chance_of_snow: z.number(),
  condition: conditionSchema,
  uv: z.number(),
});

export const astroSchema = z.object({
  sunrise: z.string(),
  sunset: z.string(),
  moonrise: z.string(),
  moonset: z.string(),
  moon_phase: z.string(),
  moon_illumination: z.number(),
  is_moon_up: z.number(),
  is_sun_up: z.number(),
});

export const hourSchema = z.object({
  time_epoch: z.number(),
  time: z.string(),
  temp_c: z.number(),
  temp_f: z.number(),
  is_day: z.number(),
  condition: conditionSchema,
  wind_mph: z.number(),
  wind_kph: z.number(),
  wind_degree: z.number(),
  wind_dir: z.string(),
  pressure_mb: z.number(),
  pressure_in: z.number(),
  precip_mm: z.number(),
  precip_in: z.number(),
  snow_cm: z.number(),
  humidity: z.number(),
  cloud: z.number(),
  feelslike_c: z.number(),
  feelslike_f: z.number(),
  windchill_c: z.number(),
  windchill_f: z.number(),
  heatindex_c: z.number(),
  heatindex_f: z.number(),
  dewpoint_c: z.number(),
  dewpoint_f: z.number(),
  will_it_rain: z.number(),
  chance_of_rain: z.number(),
  will_it_snow: z.number(),
  chance_of_snow: z.number(),
  vis_km: z.number(),
  vis_miles: z.number(),
  gust_mph: z.number(),
  gust_kph: z.number(),
  uv: z.number(),
});

export const forecastDaySchema = z.object({
  date: z.string(),
  date_epoch: z.number(),
  day: daySchema,
  astro: astroSchema,
  hour: z.array(hourSchema),
});

export const forecastSchema = z.object({
  forecastday: z.array(forecastDaySchema),
});

export const weatherSchema = z.object({
  location: locationSchema,
  current: currentSchema,
  forecast: forecastSchema.optional(),
});

export type WeatherData = z.infer<typeof weatherSchema>;
export type LocationData = z.infer<typeof locationSchema>;
export type CurrentData = z.infer<typeof currentSchema>;
export type ConditionData = z.infer<typeof conditionSchema>;
export type ForecastData = z.infer<typeof forecastSchema>;
export type ForecastDayData = z.infer<typeof forecastDaySchema>;
export type DayData = z.infer<typeof daySchema>;
export type AstroData = z.infer<typeof astroSchema>;
export type HourData = z.infer<typeof hourSchema>;
