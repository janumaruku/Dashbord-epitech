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

type WeatherSmallWidgetProps = {
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

export default function WeatherSmallWidget({
  city,
  temperature,
  condition,
  weatherCode,
  unit,
  refreshRate,
  onConfigSave,
}: WeatherSmallWidgetProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const displayedTemperature =
    convertTemperature(temperature, unit);

  const unitSymbol =
    unit === "celsius" ? "C" : "F";

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
      <WidgetHeader
        title="WEATHER"
        onConfigure={openConfig}
        onDelete={openDeleteConfirm}
        menuOpen={menuOpen}
        onMenuOpenChange={setMenuOpen}
      />

      <div className="flex-1 px-4 py-4">
        <p className="text-base text-zinc-400">
          {city}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-3xl font-semibold">
              {displayedTemperature}°{unitSymbol}
            </p>

            <p className="mt-1 whitespace-nowrap text-base text-zinc-400">
              {condition}
            </p>
          </div>

          <WeatherIcon
            weatherCode={weatherCode}
            size={78}
          />
        </div>
      </div>

      <WidgetFooter
        lastUpdated="3 min ago"
        sourceUrl="https://openweathermap.org"
        sourceName="OpenWeather"
      />

      {configOpen && (
        <WeatherConfigModal
          city={city}
          size="small"
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