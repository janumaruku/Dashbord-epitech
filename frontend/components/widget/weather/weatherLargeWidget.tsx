"use client";

import { useState } from "react";

import WidgetHeader from "@/components/widget/widgetHeader";
import WidgetFooter from "@/components/widget/widgetFooter";
import WidgetDeleteConfirm from "@/components/widget/widgetDeleteConfirm";
import WeatherIcon from "@/components/widget/weather/weatherIcon";
import WeatherHourlyForecast from "@/components/widget/weather/weatherHourlyForecast";
import WeatherDailyForecast from "@/components/widget/weather/weatherDailyForecast";

type WeatherLargeWidgetProps = {
  city: string;
  temperature: number;
  condition: string;
  weatherCode: number;
};

export default function WeatherLargeWidget({
  city,
  temperature,
  condition,
  weatherCode,
}: WeatherLargeWidgetProps) {
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

  const dailyForecast = [
    { day: "Sat", minTemperature: 13, maxTemperature: 20, weatherCode: 801 },
    { day: "Sun", minTemperature: 11, maxTemperature: 17, weatherCode: 500 },
    { day: "Mon", minTemperature: 10, maxTemperature: 18, weatherCode: 803 },
    { day: "Tue", minTemperature: 12, maxTemperature: 22, weatherCode: 800 },
    { day: "Wed", minTemperature: 14, maxTemperature: 23, weatherCode: 801 },
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

      <div className="flex flex-1 flex-col px-4 pb-1 pt-3">
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-base text-zinc-400">
              {city}
            </p>

            <p className="mt-1 text-3xl font-semibold">
              {temperature}°C
            </p>

            <p className="mt-1 text-base text-zinc-400">
              {condition}
            </p>
          </div>

          <WeatherIcon
            weatherCode={weatherCode}
            size={76}
          />
        </div>

        <div className="my-2 border-t border-zinc-800" />

        <WeatherHourlyForecast
          forecast={hourlyForecast}
        />

        <div className="mt-2">
          <div className="mb-2 border-t border-zinc-800" />

          <WeatherDailyForecast
            forecast={dailyForecast}
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