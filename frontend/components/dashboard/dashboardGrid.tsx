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

const breakpointColumns: Record<DashboardBreakpoint, number> = {
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
  {
    id: "weather-tokyo",
    city: "Tokyo",
    temperature: 25,
    condition: "Clear",
    weatherCode: 800,
    size: "small",
    unit: "celsius",
    refreshRate: 5,
  },
  {
    id: "weather-lyon",
    city: "Lyon",
    temperature: 19,
    condition: "Cloudy",
    weatherCode: 802,
    size: "medium",
    unit: "celsius",
    refreshRate: 5,
  },
  {
    id: "weather-oslo",
    city: "Oslo",
    temperature: 8,
    condition: "Snow",
    weatherCode: 601,
    size: "small",
    unit: "celsius",
    refreshRate: 5,
  },
  {
    id: "weather-lisbon",
    city: "Lisbon",
    temperature: 23,
    condition: "Clear",
    weatherCode: 800,
    size: "small",
    unit: "celsius",
    refreshRate: 5,
  },
  {
    id: "weather-london",
    city: "London",
    temperature: 16,
    condition: "Rain",
    weatherCode: 500,
    size: "large",
    unit: "celsius",
    refreshRate: 5,
  },
  {
    id: "weather-new-york",
    city: "New York",
    temperature: 20,
    condition: "Cloudy",
    weatherCode: 803,
    size: "large",
    unit: "celsius",
    refreshRate: 5,
  },
  {
    id: "weather-brussels",
    city: "Brussels",
    temperature: 15,
    condition: "Rain",
    weatherCode: 500,
    size: "medium",
    unit: "celsius",
    refreshRate: 5,
  },
  {
    id: "weather-sydney",
    city: "Sydney",
    temperature: 26,
    condition: "Clear",
    weatherCode: 800,
    size: "large",
    unit: "celsius",
    refreshRate: 5,
  },
  {
    id: "weather-madrid",
    city: "Madrid",
    temperature: 27,
    condition: "Clear",
    weatherCode: 800,
    size: "small",
    unit: "celsius",
    refreshRate: 5,
  },
  {
    id: "weather-prague",
    city: "Prague",
    temperature: 15,
    condition: "Cloudy",
    weatherCode: 803,
    size: "small",
    unit: "celsius",
    refreshRate: 5,
  },
  {
    id: "weather-stockholm",
    city: "Stockholm",
    temperature: 9,
    condition: "Rain",
    weatherCode: 500,
    size: "small",
    unit: "celsius",
    refreshRate: 5,
  },
  {
    id: "weather-athens",
    city: "Athens",
    temperature: 29,
    condition: "Clear",
    weatherCode: 800,
    size: "small",
    unit: "celsius",
    refreshRate: 5,
  },
];

const initialLayouts: ResponsiveLayouts = {
  desktop: [
    { i: "weather-paris", x: 0, y: 0, w: 1, h: 4 },
    { i: "weather-tokyo", x: 1, y: 0, w: 1, h: 4 },
    { i: "weather-lyon", x: 2, y: 0, w: 2, h: 4 },
    { i: "weather-oslo", x: 4, y: 0, w: 1, h: 4 },
    { i: "weather-lisbon", x: 5, y: 0, w: 1, h: 4 },

    { i: "weather-london", x: 0, y: 4, w: 2, h: 8 },
    { i: "weather-new-york", x: 2, y: 4, w: 2, h: 8 },
    { i: "weather-sydney", x: 4, y: 4, w: 2, h: 8 },

    { i: "weather-madrid", x: 0, y: 12, w: 1, h: 4 },
    { i: "weather-brussels", x: 1, y: 12, w: 2, h: 4 },
    { i: "weather-prague", x: 3, y: 12, w: 1, h: 4 },
    { i: "weather-stockholm", x: 4, y: 12, w: 1, h: 4 },
    { i: "weather-athens", x: 5, y: 12, w: 1, h: 4 },
  ],

  tabletLandscape: [
    { i: "weather-paris", x: 0, y: 0, w: 1, h: 4 },
    { i: "weather-tokyo", x: 1, y: 0, w: 1, h: 4 },
    { i: "weather-lyon", x: 2, y: 0, w: 2, h: 4 },

    { i: "weather-oslo", x: 0, y: 4, w: 1, h: 4 },
    { i: "weather-lisbon", x: 1, y: 4, w: 1, h: 4 },
    { i: "weather-brussels", x: 2, y: 4, w: 2, h: 4 },

    { i: "weather-london", x: 0, y: 8, w: 2, h: 8 },
    { i: "weather-new-york", x: 2, y: 8, w: 2, h: 8 },

    { i: "weather-sydney", x: 0, y: 16, w: 2, h: 8 },

    { i: "weather-madrid", x: 2, y: 16, w: 1, h: 4 },
    { i: "weather-prague", x: 3, y: 16, w: 1, h: 4 },

    { i: "weather-stockholm", x: 2, y: 20, w: 1, h: 4 },
    { i: "weather-athens", x: 3, y: 20, w: 1, h: 4 },
  ],

  tabletPortrait: [
    { i: "weather-paris", x: 0, y: 0, w: 1, h: 4 },
    { i: "weather-tokyo", x: 1, y: 0, w: 1, h: 4 },

    { i: "weather-lyon", x: 0, y: 4, w: 2, h: 4 },

    { i: "weather-oslo", x: 0, y: 8, w: 1, h: 4 },
    { i: "weather-lisbon", x: 1, y: 8, w: 1, h: 4 },

    { i: "weather-london", x: 0, y: 12, w: 2, h: 8 },
    { i: "weather-new-york", x: 0, y: 20, w: 2, h: 8 },

    { i: "weather-brussels", x: 0, y: 28, w: 2, h: 4 },

    { i: "weather-sydney", x: 0, y: 32, w: 2, h: 8 },

    { i: "weather-madrid", x: 0, y: 40, w: 1, h: 4 },
    { i: "weather-prague", x: 1, y: 40, w: 1, h: 4 },

    { i: "weather-stockholm", x: 0, y: 44, w: 1, h: 4 },
    { i: "weather-athens", x: 1, y: 44, w: 1, h: 4 },
  ],

  mobile: [
    { i: "weather-paris", x: 0, y: 0, w: 1, h: 4 },
    { i: "weather-tokyo", x: 0, y: 4, w: 1, h: 4 },

    { i: "weather-lyon", x: 0, y: 8, w: 1, h: 7 },

    { i: "weather-oslo", x: 0, y: 15, w: 1, h: 4 },
    { i: "weather-lisbon", x: 0, y: 19, w: 1, h: 4 },

    { i: "weather-london", x: 0, y: 23, w: 1, h: 8 },
    { i: "weather-new-york", x: 0, y: 31, w: 1, h: 8 },

    { i: "weather-brussels", x: 0, y: 39, w: 1, h: 7 },

    { i: "weather-sydney", x: 0, y: 46, w: 1, h: 8 },

    { i: "weather-madrid", x: 0, y: 54, w: 1, h: 4 },
    { i: "weather-prague", x: 0, y: 58, w: 1, h: 4 },
    { i: "weather-stockholm", x: 0, y: 62, w: 1, h: 4 },
    { i: "weather-athens", x: 0, y: 66, w: 1, h: 4 },
  ],
};

function getGridSize(
  size: WidgetSize,
  breakpoint: DashboardBreakpoint
) {
  if (breakpoint === "mobile") {
    if (size === "small") {
      return { w: 1, h: 4 };
    }

    if (size === "medium") {
      return { w: 1, h: 7 };
    }

    return { w: 1, h: 8 };
  }

  if (size === "small") {
    return { w: 1, h: 4 };
  }

  if (size === "medium") {
    return { w: 2, h: 4 };
  }

  return { w: 2, h: 8 };
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

  function renderWidget(widget: WeatherWidgetState) {
    const commonProps = {
      city: widget.city,
      temperature: widget.temperature,
      condition: widget.condition,
      weatherCode: widget.weatherCode,
      unit: widget.unit,
      refreshRate: widget.refreshRate,
      onConfigSave: (config: WeatherConfig) =>
        updateWidgetConfig(widget.id, config),
    };

    if (widget.size === "medium") {
      return (
        <WeatherMediumWidget {...commonProps} />
      );
    }

    if (widget.size === "large") {
      return (
        <WeatherLargeWidget {...commonProps} />
      );
    }

    return (
      <WeatherSmallWidget {...commonProps} />
    );
  }

  return (
    <div ref={containerRef} className="w-full">
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
          onLayoutChange={(_, allLayouts) => {
            setLayouts(allLayouts);
          }}
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="h-full w-full"
            >
              {renderWidget(widget)}
            </div>
          ))}
        </Responsive>
      )}
    </div>
  );
}