"use client";

import { useState } from "react";

import {
  Responsive,
  type ResponsiveLayouts,
  useContainerWidth,
} from "react-grid-layout";

import WeatherSmallWidget from "@/components/widget/weather/weatherSmallWidget";
import WeatherMediumWidget from "@/components/widget/weather/weatherMediumWidget";
import WeatherLargeWidget from "@/components/widget/weather/weatherLargeWidget";

import GithubSmallWidget from "@/components/widget/github/githubSmallWidget";
import GithubLargeWidget from "@/components/widget/github/githubRepoLargeWidget";
import GithubCommitsLargeWidget from "@/components/widget/github/githubCommitsLargeWidget";

import ClockSmallWidget from "@/components/widget/clock/clockSmallWidget";
import ClockMediumWidget from "@/components/widget/clock/clockMediumWidget";

import type {
  WeatherConfig,
  WeatherWidgetType,
  TemperatureUnit,
} from "@/components/widget/weather/weatherConfigModal";

import type {
  GithubConfig,
  GithubWidgetType,
} from "@/components/widget/github/githubConfigModal";

import type {
  ClockConfig,
  ClockTimeFormat,
  ClockWidgetType,
} from "@/components/widget/clock/clockConfigModal";

type WeatherWidgetState = {
  id: string;
  city: string;
  temperature: number;
  condition: string;
  weatherCode: number;
  widgetType: WeatherWidgetType;
  unit: TemperatureUnit;
  refreshRate: number;
};

type GithubWidgetState = {
  id: string;
  widgetType: GithubWidgetType;
  username: string;
  refreshRate: number;
  repository?: string;
};

type ClockWidgetState = {
  id: string;
  city: string;
  timeZone: string;
  widgetType: ClockWidgetType;
  timeFormat: ClockTimeFormat;
};

type DashboardBreakpoint =
  | "desktop"
  | "tabletLandscape"
  | "tabletPortrait"
  | "mobile";

const breakpointColumns: Record<
  DashboardBreakpoint,
  number
> = {
  desktop: 6,
  tabletLandscape: 4,
  tabletPortrait: 2,
  mobile: 1,
};

const breakpoints: DashboardBreakpoint[] = [
  "desktop",
  "tabletLandscape",
  "tabletPortrait",
  "mobile",
];

const initialWeatherWidgets: WeatherWidgetState[] =
  [
    {
      id: "weather-paris",
      city: "Paris",
      temperature: 18,
      condition: "Cloudy",
      weatherCode: 803,
      widgetType:
        "current",
      unit: "celsius",
      refreshRate: 5,
    },
  ];

const initialGithubWidgets: GithubWidgetState[] =
  [
    {
      id: "github-profile",
      widgetType:
        "profile",
      username: "alice_01",
      refreshRate: 5,
    },
    {
      id: "github-repositories",
      widgetType:
        "repositories",
      username: "alice_01",
      refreshRate: 5,
    },
    {
      id: "github-commits",
      widgetType:
        "commits",
      username: "alice_01",
      refreshRate: 5,
      repository:
        "epitech-dashboard",
    },
  ];

const initialClockWidgets: ClockWidgetState[] =
  [
    {
      id: "clock-analog-paris",
      city: "Paris",
      timeZone:
        "Europe/Paris",
      widgetType:
        "analog",
      timeFormat: "24h",
    },
    {
      id: "clock-digital-paris",
      city: "Paris",
      timeZone:
        "Europe/Paris",
      widgetType:
        "digital",
      timeFormat: "24h",
    },
  ];

const repositories = [
  {
    name: "epitech-dashboard",
    description:
      "A personal workspace for weather, code, and feeds.",
    language: "TypeScript",
    stars: 24,
    url: "https://github.com/alice_01/epitech-dashboard",
  },
  {
    name: "go-weather-client",
    description:
      "A small, typed OpenWeatherMap client in Go.",
    language: "Go",
    stars: 12,
    url: "https://github.com/alice_01/go-weather-client",
  },
  {
    name: "rss-reader",
    description:
      "A lightweight feed parser with sensible caching.",
    language: "Go",
    stars: 8,
    url: "https://github.com/alice_01/rss-reader",
  },
  {
    name: "portfolio",
    description:
      "Personal portfolio and project showcase.",
    language: "TypeScript",
    stars: 6,
    url: "https://github.com/alice_01/portfolio",
  },
];

const commits = [
  {
    message:
      "Add responsive widget layouts",
    author: "alice_01",
    timeAgo:
      "12 minutes ago",
    hash: "a92d4f1",
    url: "https://github.com/alice_01/epitech-dashboard/commit/a92d4f1",
  },
  {
    message:
      "Improve service error messages",
    author: "alice_01",
    timeAgo:
      "38 minutes ago",
    hash: "7bc203e",
    url: "https://github.com/alice_01/epitech-dashboard/commit/7bc203e",
  },
  {
    message:
      "Add RSS feed validation",
    author: "alice_01",
    timeAgo:
      "2 hours ago",
    hash: "19e65c8",
    url: "https://github.com/alice_01/epitech-dashboard/commit/19e65c8",
  },
  {
    message:
      "Refactor dashboard widget components",
    author: "alice_01",
    timeAgo:
      "4 hours ago",
    hash: "c84f912",
    url: "https://github.com/alice_01/epitech-dashboard/commit/c84f912",
  },
];

const initialLayouts: ResponsiveLayouts =
  {
    desktop: [
      {
        i: "weather-paris",
        x: 0,
        y: 0,
        w: 1,
        h: 4,
      },
      {
        i: "github-profile",
        x: 1,
        y: 0,
        w: 1,
        h: 4,
      },
      {
        i: "github-repositories",
        x: 2,
        y: 0,
        w: 2,
        h: 8,
      },
      {
        i: "github-commits",
        x: 4,
        y: 0,
        w: 2,
        h: 8,
      },
      {
        i: "clock-analog-paris",
        x: 0,
        y: 4,
        w: 1,
        h: 4,
      },
      {
        i: "clock-digital-paris",
        x: 0,
        y: 8,
        w: 2,
        h: 4,
      },
    ],

    tabletLandscape: [
      {
        i: "weather-paris",
        x: 0,
        y: 0,
        w: 1,
        h: 4,
      },
      {
        i: "github-profile",
        x: 1,
        y: 0,
        w: 1,
        h: 4,
      },
      {
        i: "github-repositories",
        x: 2,
        y: 0,
        w: 2,
        h: 8,
      },
      {
        i: "github-commits",
        x: 0,
        y: 4,
        w: 2,
        h: 8,
      },
      {
        i: "clock-analog-paris",
        x: 2,
        y: 8,
        w: 1,
        h: 4,
      },
      {
        i: "clock-digital-paris",
        x: 0,
        y: 12,
        w: 2,
        h: 4,
      },
    ],

    tabletPortrait: [
      {
        i: "weather-paris",
        x: 0,
        y: 0,
        w: 1,
        h: 4,
      },
      {
        i: "github-profile",
        x: 1,
        y: 0,
        w: 1,
        h: 4,
      },
      {
        i: "github-repositories",
        x: 0,
        y: 4,
        w: 2,
        h: 8,
      },
      {
        i: "github-commits",
        x: 0,
        y: 12,
        w: 2,
        h: 8,
      },
      {
        i: "clock-analog-paris",
        x: 0,
        y: 20,
        w: 1,
        h: 4,
      },
      {
        i: "clock-digital-paris",
        x: 0,
        y: 24,
        w: 2,
        h: 4,
      },
    ],

    mobile: [
      {
        i: "weather-paris",
        x: 0,
        y: 0,
        w: 1,
        h: 4,
      },
      {
        i: "github-profile",
        x: 0,
        y: 4,
        w: 1,
        h: 4,
      },
      {
        i: "github-repositories",
        x: 0,
        y: 8,
        w: 1,
        h: 8,
      },
      {
        i: "github-commits",
        x: 0,
        y: 16,
        w: 1,
        h: 8,
      },
      {
        i: "clock-analog-paris",
        x: 0,
        y: 24,
        w: 1,
        h: 4,
      },
      {
        i: "clock-digital-paris",
        x: 0,
        y: 28,
        w: 1,
        h: 5,
      },
    ],
  };

function getWeatherGridSize(
  widgetType: WeatherWidgetType,
  breakpoint: DashboardBreakpoint
) {
  if (
    widgetType === "current"
  ) {
    return {
      w: 1,
      h: 4,
    };
  }

  if (
    widgetType === "hourly"
  ) {
    if (
      breakpoint === "mobile"
    ) {
      return {
        w: 1,
        h: 7,
      };
    }

    return {
      w: 2,
      h: 4,
    };
  }

  if (
    breakpoint === "mobile"
  ) {
    return {
      w: 1,
      h: 8,
    };
  }

  return {
    w: 2,
    h: 8,
  };
}

function getGithubGridSize(
  widgetType: GithubWidgetType,
  breakpoint: DashboardBreakpoint
) {
  if (
    widgetType === "profile"
  ) {
    return {
      w: 1,
      h: 4,
    };
  }

  if (
    breakpoint === "mobile"
  ) {
    return {
      w: 1,
      h: 8,
    };
  }

  return {
    w: 2,
    h: 8,
  };
}

function getClockGridSize(
  widgetType: ClockWidgetType,
  breakpoint: DashboardBreakpoint
) {
  if (
    widgetType === "analog"
  ) {
    return {
      w: 1,
      h: 4,
    };
  }

  if (
    breakpoint === "mobile"
  ) {
    return {
      w: 1,
      h: 5,
    };
  }

  return {
    w: 2,
    h: 4,
  };
}

export default function DashboardGrid() {
  const [
    weatherWidgets,
    setWeatherWidgets,
  ] = useState<
    WeatherWidgetState[]
  >(initialWeatherWidgets);

  const [
    githubWidgets,
    setGithubWidgets,
  ] = useState<
    GithubWidgetState[]
  >(initialGithubWidgets);

  const [
    clockWidgets,
    setClockWidgets,
  ] = useState<
    ClockWidgetState[]
  >(initialClockWidgets);

  const [
    layouts,
    setLayouts,
  ] =
    useState<ResponsiveLayouts>(
      initialLayouts
    );

  const {
    width,
    containerRef,
    mounted,
  } = useContainerWidth({
    measureBeforeMount: true,
    initialWidth: 1400,
  });

  function updateWeatherConfig(
    widgetId: string,
    config: WeatherConfig
  ) {
    setWeatherWidgets(
      (currentWidgets) =>
        currentWidgets.map(
          (widget) =>
            widget.id === widgetId
              ? {
                  ...widget,
                  city:
                    config.city,
                  widgetType:
                    config.widgetType,
                  unit:
                    config.unit,
                  refreshRate:
                    config.refreshRate,
                }
              : widget
        )
    );

    setLayouts(
      (currentLayouts) => {
        const nextLayouts: ResponsiveLayouts =
          {
            ...currentLayouts,
          };

        for (
          const breakpoint
          of breakpoints
        ) {
          const currentLayout =
            currentLayouts[
              breakpoint
            ];

          if (!currentLayout) {
            continue;
          }

          const { w, h } =
            getWeatherGridSize(
              config.widgetType,
              breakpoint
            );

          const columnCount =
            breakpointColumns[
              breakpoint
            ];

          nextLayouts[
            breakpoint
          ] = currentLayout.map(
            (item) => {
              if (
                item.i !==
                widgetId
              ) {
                return item;
              }

              return {
                ...item,
                w,
                h,
                x: Math.min(
                  item.x,
                  Math.max(
                    0,
                    columnCount -
                      w
                  )
                ),
              };
            }
          );
        }

        return nextLayouts;
      }
    );
  }

  function updateGithubConfig(
    widgetId: string,
    config: GithubConfig
  ) {
    setGithubWidgets(
      (currentWidgets) =>
        currentWidgets.map(
          (widget) =>
            widget.id === widgetId
              ? {
                  ...widget,
                  widgetType:
                    config.widgetType,
                  refreshRate:
                    config.refreshRate,
                  repository:
                    config.repository,
                }
              : widget
        )
    );

    setLayouts(
      (currentLayouts) => {
        const nextLayouts: ResponsiveLayouts =
          {
            ...currentLayouts,
          };

        for (
          const breakpoint
          of breakpoints
        ) {
          const currentLayout =
            currentLayouts[
              breakpoint
            ];

          if (!currentLayout) {
            continue;
          }

          const { w, h } =
            getGithubGridSize(
              config.widgetType,
              breakpoint
            );

          const columnCount =
            breakpointColumns[
              breakpoint
            ];

          nextLayouts[
            breakpoint
          ] = currentLayout.map(
            (item) => {
              if (
                item.i !==
                widgetId
              ) {
                return item;
              }

              return {
                ...item,
                w,
                h,
                x: Math.min(
                  item.x,
                  Math.max(
                    0,
                    columnCount -
                      w
                  )
                ),
              };
            }
          );
        }

        return nextLayouts;
      }
    );
  }

  function updateClockConfig(
    widgetId: string,
    config: ClockConfig
  ) {
    setClockWidgets(
      (currentWidgets) =>
        currentWidgets.map(
          (widget) =>
            widget.id === widgetId
              ? {
                  ...widget,
                  city:
                    config.city,
                  timeZone:
                    config.timeZone,
                  widgetType:
                    config.widgetType,
                  timeFormat:
                    config.timeFormat,
                }
              : widget
        )
    );

    setLayouts(
      (currentLayouts) => {
        const nextLayouts: ResponsiveLayouts =
          {
            ...currentLayouts,
          };

        for (
          const breakpoint
          of breakpoints
        ) {
          const currentLayout =
            currentLayouts[
              breakpoint
            ];

          if (!currentLayout) {
            continue;
          }

          const { w, h } =
            getClockGridSize(
              config.widgetType,
              breakpoint
            );

          const columnCount =
            breakpointColumns[
              breakpoint
            ];

          nextLayouts[
            breakpoint
          ] = currentLayout.map(
            (item) => {
              if (
                item.i !==
                widgetId
              ) {
                return item;
              }

              return {
                ...item,
                w,
                h,
                x: Math.min(
                  item.x,
                  Math.max(
                    0,
                    columnCount -
                      w
                  )
                ),
              };
            }
          );
        }

        return nextLayouts;
      }
    );
  }

  function renderWeatherWidget(
    widget: WeatherWidgetState
  ) {
    const commonProps = {
      city: widget.city,
      temperature:
        widget.temperature,
      condition:
        widget.condition,
      weatherCode:
        widget.weatherCode,
      widgetType:
        widget.widgetType,
      unit: widget.unit,
      refreshRate:
        widget.refreshRate,

      onConfigSave: (
        config: WeatherConfig
      ) =>
        updateWeatherConfig(
          widget.id,
          config
        ),
    };

    if (
      widget.widgetType ===
      "hourly"
    ) {
      return (
        <WeatherMediumWidget
          {...commonProps}
        />
      );
    }

    if (
      widget.widgetType ===
      "forecast"
    ) {
      return (
        <WeatherLargeWidget
          {...commonProps}
        />
      );
    }

    return (
      <WeatherSmallWidget
        {...commonProps}
      />
    );
  }

  function renderGithubWidget(
    widget: GithubWidgetState
  ) {
    const commonProps = {
      username:
        widget.username,
      widgetType:
        widget.widgetType,
      refreshRate:
        widget.refreshRate,

      onConfigSave: (
        config: GithubConfig
      ) =>
        updateGithubConfig(
          widget.id,
          config
        ),
    };

    if (
      widget.widgetType ===
      "repositories"
    ) {
      return (
        <GithubLargeWidget
          {...commonProps}
          repositories={
            repositories
          }
        />
      );
    }

    if (
      widget.widgetType ===
      "commits"
    ) {
      return (
        <GithubCommitsLargeWidget
          {...commonProps}
          repository={
            widget.repository ??
            "epitech-dashboard"
          }
          commits={commits}
        />
      );
    }

    return (
      <GithubSmallWidget
        {...commonProps}
        name="Alice Laurent"
        followers={128}
        publicRepos={24}
      />
    );
  }

  function renderClockWidget(
    widget: ClockWidgetState
  ) {
    const commonProps = {
      city: widget.city,
      timeZone:
        widget.timeZone,
      widgetType:
        widget.widgetType,
      timeFormat:
        widget.timeFormat,

      onConfigSave: (
        config: ClockConfig
      ) =>
        updateClockConfig(
          widget.id,
          config
        ),
    };

    if (
      widget.widgetType ===
      "digital"
    ) {
      return (
        <ClockMediumWidget
          {...commonProps}
        />
      );
    }

    return (
      <ClockSmallWidget
        {...commonProps}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full"
    >
      {mounted && (
        <Responsive
          width={width}
          layouts={layouts}
          breakpoints={{
            desktop: 1280,
            tabletLandscape: 1024,
            tabletPortrait: 640,
            mobile: 0,
          }}
          cols={{
            desktop: 6,
            tabletLandscape: 4,
            tabletPortrait: 2,
            mobile: 1,
          }}
          rowHeight={52}
          margin={[16, 16]}
          containerPadding={[
            0,
            0,
          ]}
          dragConfig={{
            enabled: true,
            handle:
              ".widget-drag-handle",
          }}
          resizeConfig={{
            enabled: false,
          }}
          onLayoutChange={(
            _,
            allLayouts
          ) => {
            setLayouts(
              allLayouts
            );
          }}
        >
          {weatherWidgets.map(
            (widget) => (
              <div
                key={
                  widget.id
                }
                className="h-full w-full"
              >
                {renderWeatherWidget(
                  widget
                )}
              </div>
            )
          )}

          {githubWidgets.map(
            (widget) => (
              <div
                key={
                  widget.id
                }
                className="h-full w-full"
              >
                {renderGithubWidget(
                  widget
                )}
              </div>
            )
          )}

          {clockWidgets.map(
            (widget) => (
              <div
                key={
                  widget.id
                }
                className="h-full w-full"
              >
                {renderClockWidget(
                  widget
                )}
              </div>
            )
          )}
        </Responsive>
      )}
    </div>
  );
}