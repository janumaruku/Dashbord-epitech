"use client";

import { useState } from "react";

import WeatherIcon from "@/components/widget/weather/weatherIcon";
import WidgetHeader from "@/components/widget/widgetHeader";
import WidgetFooter from "@/components/widget/widgetFooter";
import WidgetDeleteConfirm from "@/components/widget/widgetDeleteConfirm";

import WeatherConfigModal, {
  type WeatherConfig,
  type WeatherWidgetType,
  type TemperatureUnit,
} from "@/components/widget/weather/weatherConfigModal";

type WeatherSmallWidgetProps = {
  city: string;
  temperature: number;
  condition: string;
  weatherCode: number;

  widgetType: WeatherWidgetType;
  unit: TemperatureUnit;
  refreshRate: number;

  onConfigSave: (config: WeatherConfig) => void;
  onDelete: () => void;
};

function convertTemperature(
  celsius: number,
  unit: TemperatureUnit
) {
  if (unit === "fahrenheit") {
    return Math.round((celsius * 9) / 5 + 32);
  }

  return Math.round(celsius);
}

export default function WeatherSmallWidget({
  city,
  temperature,
  condition,
  weatherCode,
  widgetType,
  unit,
  refreshRate,
  onConfigSave,
  onDelete,
}: WeatherSmallWidgetProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const displayedTemperature = convertTemperature(
    temperature,
    unit
  );

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
    onDelete();
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

      <div className="flex min-h-0 flex-1 items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-zinc-400">
            {city}
          </p>

          <p className="mt-1 text-4xl font-semibold">
            {displayedTemperature}°{unitSymbol}
          </p>

          <p className="mt-1 truncate text-sm text-zinc-500">
            {condition}
          </p>
        </div>

        <div className="shrink-0">
          <WeatherIcon
            weatherCode={weatherCode}
            size={72}
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