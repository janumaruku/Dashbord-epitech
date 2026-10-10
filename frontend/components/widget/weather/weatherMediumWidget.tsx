"use client";

import { useState } from "react";

import WidgetHeader from "@/components/widget/widgetHeader";
import WidgetFooter from "@/components/widget/widgetFooter";
import WidgetDeleteConfirm from "@/components/widget/widgetDeleteConfirm";

import WeatherConfigModal, {
  type WeatherConfig,
  type TemperatureUnit,
} from "@/components/widget/weather/weatherConfigModal";

import WeatherIcon from "@/components/widget/weather/weatherIcon";
import WeatherHourlyForecast from "@/components/widget/weather/weatherHourlyForecast";

type WeatherMediumWidgetProps = {
  city: string;
  temperature: number;
  condition: string;
  weatherCode: number;
  unit: TemperatureUnit;
  refreshRate: number;
  onConfigSave: (config: WeatherConfig) => void;
};

function convertTemperature(
  celsius: number,
  unit: TemperatureUnit
) {
  if (unit === "fahrenheit") {
    return Math.round((celsius * 9) / 5 + 32);
  }

  return celsius;
}

export default function WeatherMediumWidget({
  city,
  temperature,
  condition,
  weatherCode,
  unit,
  refreshRate,
  onConfigSave,
}: WeatherMediumWidgetProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const displayedTemperature =
    convertTemperature(temperature, unit);

  const unitSymbol =
    unit === "celsius" ? "C" : "F";

  const hourlyForecast = [
    { time: "17:00", temperature: 18, weatherCode: 803 },
    { time: "18:00", temperature: 17, weatherCode: 802 },
    { time: "19:00", temperature: 17, weatherCode: 802 },
    { time: "20:00", temperature: 16, weatherCode: 803 },
    { time: "21:00", temperature: 15, weatherCode: 500 },
    { time: "22:00", temperature: 14, weatherCode: 500 },
  ].map((hour) => ({
    ...hour,
    temperature: convertTemperature(
      hour.temperature,
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
    console.log("Delete widget");
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

      <div className="flex min-h-0 flex-1 flex-col px-4 py-2 md:flex-row md:items-center">
        <div className="flex shrink-0 items-center justify-between md:w-[180px] md:pr-4">
          <div>
            <p className="text-base text-zinc-400">
              {city}
            </p>

            <p className="text-3xl font-semibold">
              {displayedTemperature}°{unitSymbol}
            </p>

            <p className="text-sm text-zinc-400">
              {condition}
            </p>
          </div>

          <WeatherIcon
            weatherCode={weatherCode}
            size={54}
          />
        </div>

        <div className="my-2 shrink-0 border-t border-zinc-800 md:my-0 md:h-full md:border-l md:border-t-0" />

        <div className="flex min-h-0 min-w-0 flex-1 items-center md:pl-4">
          <WeatherHourlyForecast
            forecast={hourlyForecast}
          />
        </div>
      </div>

      <div className="shrink-0">
        <WidgetFooter
          lastUpdated="3 min ago"
          sourceUrl="https://openweathermap.org"
          sourceName="OpenWeather"
        />
      </div>

      {configOpen && (
        <WeatherConfigModal
          city={city}
          size="medium"
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