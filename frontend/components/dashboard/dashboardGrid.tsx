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

import type {
  WeatherConfig,
  WidgetSize,
  TemperatureUnit,
} from "@/components/widget/weather/weatherConfigModal";

type WeatherWidgetState = {
  id: string;
  city: string;
  temperature: number;
  condition: string;
  weatherCode: number;
  size: WidgetSize;
  unit: TemperatureUnit;
  refreshRate: number;
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

const initialWidgets: WeatherWidgetState[] = [
  {
    id: "weather-paris",
    city: "Paris",
    temperature: 18,
    condition: "Cloudy",
    weatherCode: 803,
    size: "small",
    unit: "celsius",
    refreshRate: 5,
  },
];

const initialLayouts: ResponsiveLayouts = {
  desktop: [
    {
      i: "weather-paris",
      x: 0,
      y: 0,
      w: 1,
      h: 4,
    },
    {
      i: "github-alice",
      x: 1,
      y: 0,
      w: 1,
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
      i: "github-alice",
      x: 1,
      y: 0,
      w: 1,
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
      i: "github-alice",
      x: 1,
      y: 0,
      w: 1,
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
      i: "github-alice",
      x: 0,
      y: 4,
      w: 1,
      h: 4,
    },
  ],
};

function getGridSize(
  size: WidgetSize,
  breakpoint: DashboardBreakpoint
) {
  if (breakpoint === "mobile") {
    if (size === "small") {
      return {
        w: 1,
        h: 4,
      };
    }

    if (size === "medium") {
      return {
        w: 1,
        h: 7,
      };
    }

    return {
      w: 1,
      h: 8,
    };
  }

  if (size === "small") {
    return {
      w: 1,
      h: 4,
    };
  }

  if (size === "medium") {
    return {
      w: 2,
      h: 4,
    };
  }

  return {
    w: 2,
    h: 8,
  };
}

export default function DashboardGrid() {
  const [widgets, setWidgets] =
    useState<WeatherWidgetState[]>(initialWidgets);

  const [layouts, setLayouts] =
    useState<ResponsiveLayouts>(initialLayouts);

  const {
    width,
    containerRef,
    mounted,
  } = useContainerWidth({
    measureBeforeMount: true,
    initialWidth: 1400,
  });

  function updateWidgetConfig(
    widgetId: string,
    config: WeatherConfig
  ) {
    setWidgets((currentWidgets) =>
      currentWidgets.map((widget) =>
        widget.id === widgetId
          ? {
              ...widget,
              city: config.city,
              size: config.size,
              unit: config.unit,
              refreshRate: config.refreshRate,
            }
          : widget
      )
    );

    setLayouts((currentLayouts) => {
      const nextLayouts: ResponsiveLayouts = {
        ...currentLayouts,
      };

      for (const breakpoint of breakpoints) {
        const currentLayout =
          currentLayouts[breakpoint];

        if (!currentLayout) {
          continue;
        }

        const { w, h } = getGridSize(
          config.size,
          breakpoint
        );

        const columnCount =
          breakpointColumns[breakpoint];

        nextLayouts[breakpoint] =
          currentLayout.map((item) => {
            if (item.i !== widgetId) {
              return item;
            }

            return {
              ...item,
              w,
              h,
              x: Math.min(
                item.x,
                Math.max(0, columnCount - w)
              ),
            };
          });
      }

      return nextLayouts;
    });
  }

  function renderWeatherWidget(
    widget: WeatherWidgetState
  ) {
    const commonProps = {
      city: widget.city,
      temperature: widget.temperature,
      condition: widget.condition,
      weatherCode: widget.weatherCode,
      unit: widget.unit,
      refreshRate: widget.refreshRate,

      onConfigSave: (config: WeatherConfig) =>
        updateWidgetConfig(
          widget.id,
          config
        ),
    };

    if (widget.size === "medium") {
      return (
        <WeatherMediumWidget
          {...commonProps}
        />
      );
    }

    if (widget.size === "large") {
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
          containerPadding={[0, 0]}
          dragConfig={{
            enabled: true,
            handle: ".widget-drag-handle",
          }}
          resizeConfig={{
            enabled: false,
          }}
          onLayoutChange={(
            _,
            allLayouts
          ) => {
            setLayouts(allLayouts);
          }}
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="h-full w-full"
            >
              {renderWeatherWidget(
                widget
              )}
            </div>
          ))}

          <div
            key="github-alice"
            className="h-full w-full"
          >
            <GithubSmallWidget
              name="Alice Laurent"
              username="alice_01"
              followers={128}
              publicRepos={24}
            />
          </div>
        </Responsive>
      )}
    </div>
  );
}