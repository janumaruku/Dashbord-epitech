"use client";

import {
  useState,
  useSyncExternalStore,
} from "react";

import { createPortal } from "react-dom";

import {
  ArrowLeft,
  Check,
  Clock3,
  CloudSun,
  Code2,
  Lock,
  X,
} from "lucide-react";

import {
  type ServiceId,
  useServices,
} from "@/components/services/serviceContext";

type WeatherWidgetType =
  | "current"
  | "hourly"
  | "forecast";

type GithubWidgetType =
  | "profile"
  | "repositories"
  | "commits";

type ClockWidgetType =
  | "analog"
  | "digital";

type WidgetType =
  | WeatherWidgetType
  | GithubWidgetType
  | ClockWidgetType;

type WidgetTypeOption = {
  id: WidgetType;
  name: string;
  description: string;
};

export type NewWidgetConfig = {
  service: ServiceId;
  widgetType: WidgetType;

  city?: string;

  unit?:
    | "celsius"
    | "fahrenheit";

  username?: string;

  repository?: string;

  timeZone?: string;

  timeFormat?:
    | "24h"
    | "12h";

  refreshRate?: number;
};

type AddWidgetModalProps = {
  onClose: () => void;

  onAdd: (
    config: NewWidgetConfig
  ) => void;
};

type Step = 1 | 2 | 3;

const services = [
  {
    id: "weather" as const,
    name: "Weather",
    description:
      "Temperature, forecasts, and conditions.",
    icon: CloudSun,
    widgetCount: 3,
  },
  {
    id: "github" as const,
    name: "GitHub",
    description:
      "Profiles, repositories, and commits.",
    icon: Code2,
    widgetCount: 3,
  },
  {
    id: "clock" as const,
    name: "Clock",
    description:
      "Analog and digital clocks for any city.",
    icon: Clock3,
    widgetCount: 2,
  },
];

const widgetTypes: Record<
  ServiceId,
  WidgetTypeOption[]
> = {
  weather: [
    {
      id: "current",
      name: "Current weather",
      description:
        "Current temperature and conditions for a city.",
    },
    {
      id: "hourly",
      name: "Hourly forecast",
      description:
        "Current weather with the next hours forecast.",
    },
    {
      id: "forecast",
      name: "Full forecast",
      description:
        "Current weather, hourly forecast, and upcoming days.",
    },
  ],

  github: [
    {
      id: "profile",
      name: "Profile",
      description:
        "GitHub profile, followers, and public repositories.",
    },
    {
      id: "repositories",
      name: "Recent repositories",
      description:
        "Your latest GitHub repositories and activity.",
    },
    {
      id: "commits",
      name: "Recent commits",
      description:
        "Recent commits from one of your repositories.",
    },
  ],

  clock: [
    {
      id: "analog",
      name: "Analog clock",
      description:
        "A compact analog clock for a selected city.",
    },
    {
      id: "digital",
      name: "Digital clock",
      description:
        "A digital clock with hours, minutes, and seconds.",
    },
  ],
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

export default function AddWidgetModal({
  onClose,
  onAdd,
}: AddWidgetModalProps) {
  const isClient =
    useIsClient();

  const {
    canUseService,
  } = useServices();

  const [
    step,
    setStep,
  ] =
    useState<Step>(1);

  const [
    selectedService,
    setSelectedService,
  ] =
    useState<ServiceId>(
      "weather"
    );

  const [
    selectedWidgetType,
    setSelectedWidgetType,
  ] =
    useState<WidgetType>(
      "current"
    );

  const [city, setCity] =
    useState("Paris");

  const [unit, setUnit] =
    useState<
      | "celsius"
      | "fahrenheit"
    >("celsius");

  const [
    refreshRate,
    setRefreshRate,
  ] = useState(5);

  const [username] =
    useState("alice_01");

  const [
    repository,
    setRepository,
  ] = useState(
    "epitech-dashboard"
  );

  const [
    timeFormat,
    setTimeFormat,
  ] =
    useState<
      "24h" | "12h"
    >("24h");

  function selectService(
    service: ServiceId
  ) {
    if (
      !canUseService(
        service
      )
    ) {
      return;
    }

    setSelectedService(
      service
    );

    const firstType =
      widgetTypes[
        service
      ][0];

    setSelectedWidgetType(
      firstType.id
    );
  }

  function goBack() {
    if (step === 1) {
      return;
    }

    setStep(
      (step - 1) as Step
    );
  }

  function goNext() {
    if (
      step === 1 &&
      !canUseService(
        selectedService
      )
    ) {
      return;
    }

    if (step < 3) {
      setStep(
        (step + 1) as Step
      );
    }
  }

  function handleAdd() {
    if (
      !canUseService(
        selectedService
      )
    ) {
      return;
    }

    if (
      selectedService ===
      "weather"
    ) {
      onAdd({
        service:
          "weather",

        widgetType:
          selectedWidgetType,

        city,

        unit,

        refreshRate,
      });

      return;
    }

    if (
      selectedService ===
      "github"
    ) {
      onAdd({
        service:
          "github",

        widgetType:
          selectedWidgetType,

        username,

        repository:
          selectedWidgetType ===
          "commits"
            ? repository
            : undefined,

        refreshRate,
      });

      return;
    }

    onAdd({
      service:
        "clock",

      widgetType:
        selectedWidgetType,

      city,

      timeZone:
        "Europe/Paris",

      timeFormat,
    });
  }

  if (!isClient) {
    return null;
  }

  const currentTypes:
    WidgetTypeOption[] =
      widgetTypes[
        selectedService
      ];

  const selectedServiceAvailable =
    canUseService(
      selectedService
    );

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 sm:p-6"
      onClick={
        onClose
      }
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-widget-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 text-white shadow-2xl"
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
      >
        <div className="grid shrink-0 grid-cols-[40px_1fr_40px] items-center border-b border-zinc-800 px-5 py-4">
          <div />

          <h2
            id="add-widget-title"
            className="text-center text-xl font-semibold"
          >
            Add widget
          </h2>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <X
              size={20}
            />
          </button>
        </div>

        <div className="shrink-0 px-6 pt-5">
          <div className="grid grid-cols-3 gap-2">
            <StepIndicator
              number={1}
              label="Service"
              active={
                step >= 1
              }
              current={
                step === 1
              }
            />

            <StepIndicator
              number={2}
              label="Widget type"
              active={
                step >= 2
              }
              current={
                step === 2
              }
            />

            <StepIndicator
              number={3}
              label="Configure"
              active={
                step >= 3
              }
              current={
                step === 3
              }
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {step === 1 && (
            <>
              <h3 className="text-xl font-semibold">
                Choose a service
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Only connected or
                subscribed services
                can be used.
              </p>

              <div className="mt-6 space-y-3">
                {services.map(
                  (
                    service
                  ) => {
                    const Icon =
                      service.icon;

                    const available =
                      canUseService(
                        service.id
                      );

                    const selected =
                      selectedService ===
                        service.id &&
                      available;

                    return (
                      <button
                        key={
                          service.id
                        }
                        type="button"
                        disabled={
                          !available
                        }
                        onClick={() =>
                          selectService(
                            service.id
                          )
                        }
                        className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition ${
                          !available
                            ? "cursor-not-allowed border-zinc-800 bg-zinc-950 opacity-50"
                            : selected
                              ? "border-zinc-400 bg-zinc-900"
                              : "border-zinc-700 bg-zinc-950 hover:bg-zinc-900"
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-zinc-900">
                          <Icon
                            size={
                              21
                            }
                            className="text-zinc-300"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-zinc-100">
                            {
                              service.name
                            }
                          </p>

                          <p className="mt-1 text-sm text-zinc-500">
                            {
                              service.description
                            }
                          </p>

                          {available ? (
                            <p className="mt-2 text-xs text-zinc-400">
                              {
                                service.widgetCount
                              }{" "}
                              widget types
                            </p>
                          ) : (
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                              <Lock
                                size={
                                  13
                                }
                              />

                              Connect or
                              subscribe
                              first
                            </p>
                          )}
                        </div>

                        {available ? (
                          <SelectionCircle
                            selected={
                              selected
                            }
                          />
                        ) : (
                          <Lock
                            size={
                              18
                            }
                            className="shrink-0 text-zinc-600"
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-xl font-semibold">
                Choose a widget
                type
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Choose what
                you&apos;d like
                to display.
              </p>

              <div className="mt-6 space-y-3">
                {currentTypes.map(
                  (
                    type:
                      WidgetTypeOption
                  ) => {
                    const selected =
                      selectedWidgetType ===
                      type.id;

                    return (
                      <button
                        key={
                          type.id
                        }
                        type="button"
                        onClick={() =>
                          setSelectedWidgetType(
                            type.id
                          )
                        }
                        className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition ${
                          selected
                            ? "border-zinc-400 bg-zinc-900"
                            : "border-zinc-700 bg-zinc-950 hover:bg-zinc-900"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-zinc-100">
                            {
                              type.name
                            }
                          </p>

                          <p className="mt-1 text-sm text-zinc-500">
                            {
                              type.description
                            }
                          </p>
                        </div>

                        <SelectionCircle
                          selected={
                            selected
                          }
                        />
                      </button>
                    );
                  }
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="text-xl font-semibold">
                Configure your
                widget
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Set the options
                for this widget.
              </p>

              <div className="mt-6">
                {selectedService ===
                  "weather" && (
                  <WeatherConfiguration
                    city={
                      city
                    }
                    onCityChange={
                      setCity
                    }
                    unit={
                      unit
                    }
                    onUnitChange={
                      setUnit
                    }
                    refreshRate={
                      refreshRate
                    }
                    onRefreshRateChange={
                      setRefreshRate
                    }
                  />
                )}

                {selectedService ===
                  "github" && (
                  <GithubConfiguration
                    username={
                      username
                    }
                    widgetType={
                      selectedWidgetType
                    }
                    repository={
                      repository
                    }
                    onRepositoryChange={
                      setRepository
                    }
                    refreshRate={
                      refreshRate
                    }
                    onRefreshRateChange={
                      setRefreshRate
                    }
                  />
                )}

                {selectedService ===
                  "clock" && (
                  <ClockConfiguration
                    city={
                      city
                    }
                    onCityChange={
                      setCity
                    }
                    timeFormat={
                      timeFormat
                    }
                    onTimeFormatChange={
                      setTimeFormat
                    }
                  />
                )}
              </div>
            </>
          )}
        </div>

        <div className="shrink-0 border-t border-zinc-800 p-5">
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={
                  goBack
                }
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-700 px-5 text-sm font-medium text-zinc-200 hover:bg-zinc-900"
              >
                <ArrowLeft
                  size={16}
                />

                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={
                  goNext
                }
                disabled={
                  !selectedServiceAvailable
                }
                className={`h-11 flex-1 rounded-md px-5 text-sm font-semibold ${
                  selectedServiceAvailable
                    ? "bg-zinc-100 text-zinc-950 hover:bg-white"
                    : "cursor-not-allowed bg-zinc-800 text-zinc-600"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  handleAdd
                }
                disabled={
                  !selectedServiceAvailable
                }
                className={`h-11 flex-1 rounded-md px-5 text-sm font-semibold ${
                  selectedServiceAvailable
                    ? "bg-zinc-100 text-zinc-950 hover:bg-white"
                    : "cursor-not-allowed bg-zinc-800 text-zinc-600"
                }`}
              >
                Add widget
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="mt-3 h-11 w-full rounded-md border border-zinc-700 text-sm font-medium text-zinc-300 hover:bg-zinc-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

type StepIndicatorProps = {
  number: number;
  label: string;
  active: boolean;
  current: boolean;
};

function StepIndicator({
  number,
  label,
  active,
  current,
}: StepIndicatorProps) {
  return (
    <div>
      <div
        className={`h-0.5 rounded-full ${
          active
            ? "bg-zinc-200"
            : "bg-zinc-800"
        }`}
      />

      <p
        className={`mt-2 text-xs ${
          current
            ? "text-zinc-200"
            : "text-zinc-600"
        }`}
      >
        {number} {label}
      </p>
    </div>
  );
}

function SelectionCircle({
  selected,
}: {
  selected: boolean;
}) {
  return (
    <div
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
        selected
          ? "border-zinc-200 bg-zinc-100 text-zinc-950"
          : "border-zinc-600"
      }`}
    >
      {selected && (
        <Check
          size={13}
        />
      )}
    </div>
  );
}

type WeatherConfigurationProps = {
  city: string;

  onCityChange: (
    value: string
  ) => void;

  unit:
    | "celsius"
    | "fahrenheit";

  onUnitChange: (
    value:
      | "celsius"
      | "fahrenheit"
  ) => void;

  refreshRate: number;

  onRefreshRateChange: (
    value: number
  ) => void;
};

function WeatherConfiguration({
  city,
  onCityChange,
  unit,
  onUnitChange,
  refreshRate,
  onRefreshRateChange,
}: WeatherConfigurationProps) {
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="new-weather-city"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          City
        </label>

        <input
          id="new-weather-city"
          value={city}
          onChange={(
            event
          ) =>
            onCityChange(
              event.target
                .value
            )
          }
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-zinc-500"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-300">
          Temperature unit
        </p>

        <div className="grid grid-cols-2 gap-3">
          <OptionButton
            selected={
              unit ===
              "celsius"
            }
            onClick={() =>
              onUnitChange(
                "celsius"
              )
            }
          >
            Celsius
          </OptionButton>

          <OptionButton
            selected={
              unit ===
              "fahrenheit"
            }
            onClick={() =>
              onUnitChange(
                "fahrenheit"
              )
            }
          >
            Fahrenheit
          </OptionButton>
        </div>
      </div>

      <RefreshRateSelect
        value={
          refreshRate
        }
        onChange={
          onRefreshRateChange
        }
      />
    </div>
  );
}

type GithubConfigurationProps = {
  username: string;

  widgetType: WidgetType;

  repository: string;

  onRepositoryChange: (
    value: string
  ) => void;

  refreshRate: number;

  onRefreshRateChange: (
    value: number
  ) => void;
};

function GithubConfiguration({
  username,
  widgetType,
  repository,
  onRepositoryChange,
  refreshRate,
  onRefreshRateChange,
}: GithubConfigurationProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-zinc-300">
          GitHub account
        </p>

        <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-400">
          @{username}
        </div>
      </div>

      {widgetType ===
        "commits" && (
        <div>
          <label
            htmlFor="new-github-repository"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Repository
          </label>

          <select
            id="new-github-repository"
            value={
              repository
            }
            onChange={(
              event
            ) =>
              onRepositoryChange(
                event.target
                  .value
              )
            }
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-zinc-500"
          >
            <option value="epitech-dashboard">
              epitech-dashboard
            </option>

            <option value="go-weather-client">
              go-weather-client
            </option>

            <option value="rss-reader">
              rss-reader
            </option>

            <option value="portfolio">
              portfolio
            </option>
          </select>
        </div>
      )}

      <RefreshRateSelect
        value={
          refreshRate
        }
        onChange={
          onRefreshRateChange
        }
      />
    </div>
  );
}

type ClockConfigurationProps = {
  city: string;

  onCityChange: (
    value: string
  ) => void;

  timeFormat:
    | "24h"
    | "12h";

  onTimeFormatChange: (
    value:
      | "24h"
      | "12h"
  ) => void;
};

function ClockConfiguration({
  city,
  onCityChange,
  timeFormat,
  onTimeFormatChange,
}: ClockConfigurationProps) {
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="new-clock-city"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          City
        </label>

        <input
          id="new-clock-city"
          value={city}
          onChange={(
            event
          ) =>
            onCityChange(
              event.target
                .value
            )
          }
          placeholder="Search for a city"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-500"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-300">
          Time format
        </p>

        <div className="grid grid-cols-2 gap-3">
          <OptionButton
            selected={
              timeFormat ===
              "24h"
            }
            onClick={() =>
              onTimeFormatChange(
                "24h"
              )
            }
          >
            24-hour
          </OptionButton>

          <OptionButton
            selected={
              timeFormat ===
              "12h"
            }
            onClick={() =>
              onTimeFormatChange(
                "12h"
              )
            }
          >
            12-hour
          </OptionButton>
        </div>
      </div>
    </div>
  );
}

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;

  onClick: () => void;

  children:
    React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`rounded-md border px-4 py-3 text-sm ${
        selected
          ? "border-zinc-400 bg-zinc-800 text-white"
          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
      }`}
    >
      {children}
    </button>
  );
}

function RefreshRateSelect({
  value,
  onChange,
}: {
  value: number;

  onChange: (
    value: number
  ) => void;
}) {
  return (
    <div>
      <label
        htmlFor="new-widget-refresh-rate"
        className="mb-2 block text-sm font-medium text-zinc-300"
      >
        Refresh rate
      </label>

      <select
        id="new-widget-refresh-rate"
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            Number(
              event.target
                .value
            )
          )
        }
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-zinc-500"
      >
        <option value={1}>
          Every minute
        </option>

        <option value={5}>
          Every 5 minutes
        </option>

        <option value={10}>
          Every 10 minutes
        </option>

        <option value={15}>
          Every 15 minutes
        </option>

        <option value={30}>
          Every 30 minutes
        </option>

        <option value={60}>
          Every hour
        </option>
      </select>
    </div>
  );
}