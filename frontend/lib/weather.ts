export type WeatherTemperatureData = {
  city: string;
  temperature: number;
  units: string;
  condition: string;
  humidity: number;
};

export type WeatherConditionsData = {
  city: string;
  wind_speed: number;
  wind_units: string;
  wind_direction: string;
  pressure: number;
  uv_index?: number;
  uv_category?: string;
};

export type WeatherForecastDay = {
  date: string;
  high: number;
  low: number;
  condition: string;
};

export type WeatherForecastData = {
  city: string;
  units: string;
  days: WeatherForecastDay[];
};

export function unitSymbol(units: string): string {
  return units === "fahrenheit" ? "F" : "C";
}

export function dayLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function asRecord(data: unknown): Record<string, unknown> | null {
  if (data && typeof data === "object") {
    return data as Record<string, unknown>;
  }
  return null;
}
