"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, X } from "lucide-react";

export type WidgetSize = "small" | "medium" | "large";
export type TemperatureUnit = "celsius" | "fahrenheit";

export type WeatherConfig = {
  city: string;
  size: WidgetSize;
  unit: TemperatureUnit;
  refreshRate: number;
};

type WeatherConfigModalProps = {
  city: string;
  size: WidgetSize;
  unit: TemperatureUnit;
  refreshRate: number;
  onBack: () => void;
  onClose: () => void;
  onSave: (config: WeatherConfig) => void;
};

function subscribe() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export default function WeatherConfigModal({
  city,
  size,
  unit,
  refreshRate,
  onBack,
  onClose,
  onSave,
}: WeatherConfigModalProps) {
  const isClient = useIsClient();

  const [newCity, setNewCity] = useState(city);
  const [newSize, setNewSize] = useState<WidgetSize>(size);
  const [newUnit, setNewUnit] =
    useState<TemperatureUnit>(unit);
  const [newRefreshRate, setNewRefreshRate] =
    useState(refreshRate);

  function handleSave() {
    const trimmedCity = newCity.trim();

    if (!trimmedCity) {
      return;
    }

    onSave({
      city: trimmedCity,
      size: newSize,
      unit: newUnit,
      refreshRate: newRefreshRate,
    });
  }

  if (!isClient) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="weather-config-title"
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid grid-cols-[40px_1fr_40px] items-center border-b border-zinc-800 px-5 py-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <h2
            id="weather-config-title"
            className="text-center text-xl font-semibold text-white"
          >
            Edit widget
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-6 text-base font-semibold tracking-wide text-zinc-200">
            WEATHER
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="weather-city"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                City
              </label>

              <input
                id="weather-city"
                type="text"
                value={newCity}
                onChange={(event) =>
                  setNewCity(event.target.value)
                }
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="refresh-rate"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Refresh rate
              </label>

              <select
                id="refresh-rate"
                value={newRefreshRate}
                onChange={(event) =>
                  setNewRefreshRate(
                    Number(event.target.value)
                  )
                }
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-zinc-500"
              >
                <option value={1}>Every minute</option>
                <option value={5}>Every 5 minutes</option>
                <option value={10}>Every 10 minutes</option>
                <option value={15}>Every 15 minutes</option>
                <option value={30}>Every 30 minutes</option>
                <option value={60}>Every hour</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-zinc-300">
              Widget size
            </p>

            <div className="grid grid-cols-3 gap-3">
              {(
                ["small", "medium", "large"] as WidgetSize[]
              ).map((widgetSize) => (
                <button
                  key={widgetSize}
                  type="button"
                  onClick={() =>
                    setNewSize(widgetSize)
                  }
                  className={`rounded-md border px-4 py-3 text-sm font-medium capitalize ${
                    newSize === widgetSize
                      ? "border-zinc-500 bg-zinc-800 text-white"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  {widgetSize}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-zinc-300">
              Temperature unit
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setNewUnit("celsius")
                }
                className={`rounded-md border px-4 py-3 text-sm font-medium ${
                  newUnit === "celsius"
                    ? "border-zinc-500 bg-zinc-800 text-white"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                Celsius (°C)
              </button>

              <button
                type="button"
                onClick={() =>
                  setNewUnit("fahrenheit")
                }
                className={`rounded-md border px-4 py-3 text-sm font-medium ${
                  newUnit === "fahrenheit"
                    ? "border-zinc-500 bg-zinc-800 text-white"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-zinc-800 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black hover:bg-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
