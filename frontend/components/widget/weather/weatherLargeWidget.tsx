"use client";

import { useState } from "react";

import WeatherIcon from "@/components/widget/weather/weatherIcon";
import WeatherHourlyForecast from "@/components/widget/weather/weatherHourlyForecast";
import WeatherDailyForecast from "@/components/widget/weather/weatherDailyForecast";

import WidgetHeader from "@/components/widget/widgetHeader";
import WidgetFooter from "@/components/widget/widgetFooter";
import WidgetDeleteConfirm from "@/components/widget/widgetDeleteConfirm";

import WeatherConfigModal, {
  type WeatherConfig,
  type WeatherWidgetType,
  type TemperatureUnit,
} from "@/components/widget/weather/weatherConfigModal";

type WeatherLargeWidgetProps = {
  city: string;
  temperature: number;
  condition: string;
  weatherCode: number;

  widgetType: WeatherWidgetType;
  unit: TemperatureUnit;
  refreshRate: number;

  onConfigSave: (config: WeatherConfig) => void;
};

type HourlyWeather = {
  time: string;
  temperature: number;
  weatherCode: number;
};

type DailyWeather = {
  day: string;
  minTemperature: number;
  maxTemperature: number;
  weatherCode: number;
};

const hourlyForecast: HourlyWeather[] = [
  {
    time: "17:00",
    temperature: 18,
    weatherCode: 803,
  },
  {
    time: "18:00",
    temperature: 17,
    weatherCode: 803,
  },
  {
    time: "19:00",
    temperature: 16,
    weatherCode: 802,
  },
  {
    time: "20:00",
    temperature: 15,
    weatherCode: 802,
  },
  {
    time: "21:00",
    temperature: 14,
    weatherCode: 801,
  },
  {
    time: "22:00",
    temperature: 13,
    weatherCode: 800,
  },
];

const dailyForecast: DailyWeather[] = [
  {
    day: "Sat",
    minTemperature: 11,
    maxTemperature: 18,
    weatherCode: 803,
  },
  {
    day: "Sun",
    minTemperature: 10,
    maxTemperature: 17,
    weatherCode: 500,
  },
  {
    day: "Mon",
    minTemperature: 9,
    maxTemperature: 16,
    weatherCode: 802,
  },
  {
    day: "Tue",
    minTemperature: 8,
    maxTemperature: 15,
    weatherCode: 800,
  },
  {
    day: "Wed",
    minTemperature: 9,
    maxTemperature: 16,
    weatherCode: 801,
  },
];

function convertTemperature(
  celsius: number,
  unit: TemperatureUnit
) {
  if (unit === "fahrenheit") {
    return Math.round((celsius * 9) / 5 + 32);
  }

  return Math.round(celsius);
}

export default function WeatherLargeWidget({
  city,
  temperature,
  condition,
  weatherCode,
  widgetType,
  unit,
  refreshRate,
  onConfigSave,
}: WeatherLargeWidgetProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const displayedTemperature =
    convertTemperature(
      temperature,
      unit
    );

  const unitSymbol =
    unit === "celsius" ? "C" : "F";

  const convertedHourlyForecast =
    hourlyForecast.map((hour) => ({
      ...hour,
      temperature: convertTemperature(
        hour.temperature,
        unit
      ),
    }));

  const convertedDailyForecast =
    dailyForecast.map((day) => ({
      ...day,
      minTemperature:
        convertTemperature(
          day.minTemperature,
          unit
        ),
      maxTemperature:
        convertTemperature(
          day.maxTemperature,
          unit
        ),
    }));

  function openConfig() {
    setMenuOpen(false);
    setConfigOpen(true);
  }

  function closeConfig() {
    setConfigOpen(false);
  }

  function backToMenuFromConfig() {
    setConfigOpen(false);
    setMenuOpen(true);
  }

  function saveConfig(config: WeatherConfig) {
    onConfigSave(config);
    setConfigOpen(false);
  }

  function openDeleteConfirm() {
    setMenuOpen(false);
    setDeleteOpen(true);
  }

  function closeDeleteConfirm() {
    setDeleteOpen(false);
  }

  function backToMenuFromDelete() {
    setDeleteOpen(false);
    setMenuOpen(true);
  }

  function confirmDelete() {
    setDeleteOpen(false);

    console.log("Delete weather widget");
  }

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-white">
      <div className="shrink-0">
        <WidgetHeader
          title="WEATHER"
          onConfigure={openConfig}
          onDelete={openDeleteConfirm}
          menuOpen={menuOpen}
          onMenuOpenChange={setMenuOpen}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-1 pt-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm text-zinc-400">
              {city}
            </p>

            <p className="mt-1 text-4xl font-semibold">
              {displayedTemperature}°
              {unitSymbol}
            </p>

            <p className="mt-1 truncate text-sm text-zinc-500">
              {condition}
            </p>
          </div>

          <WeatherIcon
            weatherCode={weatherCode}
            size={72}
          />
        </div>

        <div className="my-2 border-t border-zinc-800" />

        <WeatherHourlyForecast
          forecast={convertedHourlyForecast}
        />

        <div className="mt-2">
          <div className="mb-2 border-t border-zinc-800" />

          <WeatherDailyForecast
            forecast={convertedDailyForecast}
          />
        </div>
      </div>

      <div className="shrink-0">
        <WidgetFooter
          lastUpdated="3 min ago"
          sourceUrl="https://openweathermap.org/"
          sourceName="OpenWeather"
        />
      </div>

      {configOpen && (
        <WeatherConfigModal
          city={city}
          widgetType={widgetType}
          unit={unit}
          refreshRate={refreshRate}
          onBack={backToMenuFromConfig}
          onClose={closeConfig}
          onSave={saveConfig}
        />
      )}

      {deleteOpen && (
        <WidgetDeleteConfirm
          onBack={backToMenuFromDelete}
          onClose={closeDeleteConfirm}
          onConfirm={confirmDelete}
        />
      )}
    </article>
  );
}