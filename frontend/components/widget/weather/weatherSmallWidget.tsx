"use client";

import { useState } from "react";

import WidgetHeader from "@/components/widget/widgetHeader";
import WidgetFooter from "@/components/widget/widgetFooter";
import WidgetDeleteConfirm from "@/components/widget/widgetDeleteConfirm";
import WeatherIcon from "@/components/widget/weather/weatherIcon";

type WeatherSmallWidgetProps = {
  city: string;
  temperature: number;
  condition: string;
  weatherCode: number;
};

export default function WeatherSmallWidget({
  city,
  temperature,
  condition,
  weatherCode,
}: WeatherSmallWidgetProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function configureWidget() {
    console.log("Configure widget");
  }

  function openDeleteConfirm() {
    setMenuOpen(false);
    setDeleteOpen(true);
  }

  function closeDeleteConfirm() {
    setDeleteOpen(false);
  }

  function backToMenu() {
    setDeleteOpen(false);
    setMenuOpen(true);
  }

  function confirmDelete() {
    setDeleteOpen(false);
    console.log("Delete widget");
  }

  return (
    <article className="flex h-64 w-64 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-white">
      <WidgetHeader
        title="WEATHER"
        onConfigure={configureWidget}
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
              {temperature}°C
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

      {deleteOpen && (
        <WidgetDeleteConfirm
          onBack={backToMenu}
          onClose={closeDeleteConfirm}
          onConfirm={confirmDelete}
        />
      )}
    </article>
  );
}
