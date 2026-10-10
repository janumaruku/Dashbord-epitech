"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { createPortal } from "react-dom";
import {
  ArrowLeft,
  LoaderCircle,
  MapPin,
  X,
} from "lucide-react";

export type ClockWidgetType =
  | "analog"
  | "digital";

export type ClockTimeFormat =
  | "24h"
  | "12h";

export type ClockConfig = {
  city: string;
  timeZone: string;
  widgetType: ClockWidgetType;
  timeFormat: ClockTimeFormat;
};

type ClockConfigModalProps = {
  city: string;
  timeZone: string;
  widgetType: ClockWidgetType;
  timeFormat: ClockTimeFormat;

  onBack: () => void;
  onClose: () => void;
  onSave: (config: ClockConfig) => void;
};

type CitySuggestion = {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  timezone: string;
};

type GeocodingResponse = {
  results?: CitySuggestion[];
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

export default function ClockConfigModal({
  city,
  timeZone,
  widgetType,
  timeFormat,
  onBack,
  onClose,
  onSave,
}: ClockConfigModalProps) {
  const isClient = useIsClient();

  const [cityInput, setCityInput] =
    useState(city);

  const [selectedCity, setSelectedCity] =
    useState(city);

  const [selectedTimeZone, setSelectedTimeZone] =
    useState(timeZone);

  const [newWidgetType, setNewWidgetType] =
    useState<ClockWidgetType>(
      widgetType
    );

  const [newTimeFormat, setNewTimeFormat] =
    useState<ClockTimeFormat>(
      timeFormat
    );

  const [suggestions, setSuggestions] =
    useState<CitySuggestion[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const [cityError, setCityError] =
    useState("");

  useEffect(() => {
    const query = cityInput.trim();

    if (
      query.length < 2 ||
      query === selectedCity
    ) {
      return;
    }

    const controller =
      new AbortController();

    const timeout =
      window.setTimeout(
        async () => {
          try {
            setLoading(true);

            const response =
              await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                  query
                )}&count=6&language=en&format=json`,
                {
                  signal:
                    controller.signal,
                }
              );

            if (!response.ok) {
              throw new Error(
                "Unable to search cities"
              );
            }

            const data =
              (await response.json()) as GeocodingResponse;

            setSuggestions(
              data.results ?? []
            );

            setShowSuggestions(true);
          } catch (error) {
            if (
              error instanceof DOMException &&
              error.name === "AbortError"
            ) {
              return;
            }

            setSuggestions([]);
            setShowSuggestions(false);
          } finally {
            setLoading(false);
          }
        },
        350
      );

    return () => {
      window.clearTimeout(
        timeout
      );

      controller.abort();
    };
  }, [
    cityInput,
    selectedCity,
  ]);

  function handleCityInput(
    value: string
  ) {
    setCityInput(value);
    setCityError("");

    if (
      value.trim().length < 2
    ) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
    }

    if (
      value !== selectedCity
    ) {
      setSelectedCity("");
      setSelectedTimeZone("");
    }
  }

  function selectCity(
    suggestion: CitySuggestion
  ) {
    setCityInput(
      suggestion.name
    );

    setSelectedCity(
      suggestion.name
    );

    setSelectedTimeZone(
      suggestion.timezone
    );

    setSuggestions([]);
    setShowSuggestions(false);
    setLoading(false);
    setCityError("");
  }

  function handleSave() {
    if (
      !selectedCity ||
      !selectedTimeZone
    ) {
      setCityError(
        "Select a city from the suggestions."
      );

      return;
    }

    onSave({
      city: selectedCity,
      timeZone:
        selectedTimeZone,
      widgetType:
        newWidgetType,
      timeFormat:
        newTimeFormat,
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
        aria-labelledby="clock-config-title"
        className="w-full max-w-2xl overflow-visible rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="grid grid-cols-[40px_1fr_40px] items-center border-b border-zinc-800 px-5 py-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft
              size={20}
            />
          </button>

          <h2
            id="clock-config-title"
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
            CLOCK
          </p>

          <div className="relative">
            <label
              htmlFor="clock-city"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              City
            </label>

            <div className="relative">
              <input
                id="clock-city"
                type="text"
                value={cityInput}
                onChange={(event) =>
                  handleCityInput(
                    event.target.value
                  )
                }
                onFocus={() => {
                  if (
                    suggestions.length >
                    0
                  ) {
                    setShowSuggestions(
                      true
                    );
                  }
                }}
                placeholder="Search for a city"
                autoComplete="off"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 pr-10 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-500"
              />

              {loading && (
                <LoaderCircle
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-zinc-500"
                />
              )}
            </div>

            {showSuggestions &&
              suggestions.length >
                0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 shadow-xl">
                  {suggestions.map(
                    (
                      suggestion
                    ) => (
                      <button
                        key={
                          suggestion.id
                        }
                        type="button"
                        onClick={() =>
                          selectCity(
                            suggestion
                          )
                        }
                        className="flex w-full items-start gap-3 border-b border-zinc-800 px-3 py-3 text-left last:border-b-0 hover:bg-zinc-800"
                      >
                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-zinc-500"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-100">
                            {
                              suggestion.name
                            }
                          </p>

                          <p className="truncate text-xs text-zinc-500">
                            {[
                              suggestion.admin1,
                              suggestion.country,
                            ]
                              .filter(
                                Boolean
                              )
                              .join(
                                ", "
                              )}
                          </p>
                        </div>
                      </button>
                    )
                  )}
                </div>
              )}

            {cityError && (
              <p className="mt-2 text-xs text-red-400">
                {cityError}
              </p>
            )}

            {selectedTimeZone && (
              <p className="mt-2 text-xs text-zinc-500">
                {
                  selectedTimeZone
                }
              </p>
            )}
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-zinc-300">
              Widget type
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setNewWidgetType(
                    "analog"
                  )
                }
                className={`rounded-md border px-4 py-3 text-sm ${
                  newWidgetType ===
                  "analog"
                    ? "border-zinc-500 bg-zinc-800 text-white"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                Analog clock
              </button>

              <button
                type="button"
                onClick={() =>
                  setNewWidgetType(
                    "digital"
                  )
                }
                className={`rounded-md border px-4 py-3 text-sm ${
                  newWidgetType ===
                  "digital"
                    ? "border-zinc-500 bg-zinc-800 text-white"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                Digital clock
              </button>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-zinc-300">
              Time format
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setNewTimeFormat(
                    "24h"
                  )
                }
                className={`rounded-md border px-4 py-3 text-sm ${
                  newTimeFormat ===
                  "24h"
                    ? "border-zinc-500 bg-zinc-800 text-white"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                24-hour
              </button>

              <button
                type="button"
                onClick={() =>
                  setNewTimeFormat(
                    "12h"
                  )
                }
                className={`rounded-md border px-4 py-3 text-sm ${
                  newTimeFormat ===
                  "12h"
                    ? "border-zinc-500 bg-zinc-800 text-white"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                12-hour
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
              onClick={
                handleSave
              }
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