"use client";

import { useState } from "react";

import WidgetHeader from "@/components/widget/widgetHeader";
import WidgetFooter from "@/components/widget/widgetFooter";
import WidgetDeleteConfirm from "@/components/widget/widgetDeleteConfirm";
import WeatherIcon from "@/components/widget/weather/weatherIcon";
import WeatherHourlyForecast from "@/components/widget/weather/weatherHourlyForecast";

type WeatherMediumWidgetProps = {
  city: string;
  temperature: number;
  condition: string;
  weatherCode: number;
};

export default function WeatherMediumWidget({
  city,
  temperature,
  condition,
  weatherCode,
}: WeatherMediumWidgetProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const hourlyForecast = [
    { time: "17:00", temperature: 18, weatherCode: 803 },
    { time: "18:00", temperature: 17, weatherCode: 802 },
    { time: "19:00", temperature: 17, weatherCode: 802 },
    { time: "20:00", temperature: 16, weatherCode: 803 },
    { time: "21:00", temperature: 15, weatherCode: 500 },
    { time: "22:00", temperature: 14, weatherCode: 500 },
  ];

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
    <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-white">
      <WidgetHeader
        title="WEATHER"
        onConfigure={configureWidget}
        onDelete={openDeleteConfirm}
        menuOpen={menuOpen}
        onMenuOpenChange={setMenuOpen}
      />

      <div className="flex flex-1 items-center px-4 py-3">
        <div className="flex w-[180px] shrink-0 items-center justify-between pr-4">
          <div>
            <p className="text-base text-zinc-400">
              {city}
            </p>

            <p className="mt-1 text-3xl font-semibold">
              {temperature}°C
            </p>

            <p className="mt-1 whitespace-nowrap text-base text-zinc-400">
              {condition}
            </p>
          </div>

          <WeatherIcon
            weatherCode={weatherCode}
            size={60}
          />
        </div>

        <div className="h-full border-l border-zinc-800" />

        <div className="min-w-0 flex-1 pl-4">
          <WeatherHourlyForecast
            forecast={hourlyForecast}
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
