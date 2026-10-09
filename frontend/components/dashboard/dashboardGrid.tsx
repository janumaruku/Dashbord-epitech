"use client";

import { useState } from "react";
import ReactGridLayout, {
  type Layout,
  useContainerWidth,
} from "react-grid-layout";

import WeatherSmallWidget from "@/components/widget/weather/weatherSmallWidget";
import WeatherMediumWidget from "@/components/widget/weather/weatherMediumWidget";
import WeatherLargeWidget from "@/components/widget/weather/weatherLargeWidget";

const initialLayout: Layout = [
  // Row 1
  { i: "weather-paris", x: 0, y: 0, w: 1, h: 1 },
  { i: "weather-tokyo", x: 1, y: 0, w: 1, h: 1 },

  { i: "weather-lyon", x: 2, y: 0, w: 2, h: 1 },

  { i: "weather-oslo", x: 4, y: 0, w: 1, h: 1 },
  { i: "weather-lisbon", x: 5, y: 0, w: 1, h: 1 },

  // Rows 2-3
  { i: "weather-london", x: 0, y: 1, w: 2, h: 2 },
  { i: "weather-new-york", x: 2, y: 1, w: 2, h: 2 },
  { i: "weather-sydney", x: 4, y: 1, w: 2, h: 2 },

  // Row 4
  { i: "weather-madrid", x: 0, y: 3, w: 1, h: 1 },

  { i: "weather-brussels", x: 1, y: 3, w: 2, h: 1 },

  { i: "weather-prague", x: 3, y: 3, w: 1, h: 1 },
  { i: "weather-stockholm", x: 4, y: 3, w: 1, h: 1 },
  { i: "weather-athens", x: 5, y: 3, w: 1, h: 1 },

  // Rows 5-6
  { i: "weather-montreal", x: 0, y: 4, w: 2, h: 2 },
  { i: "weather-barcelona", x: 2, y: 4, w: 2, h: 2 },
  { i: "weather-amsterdam", x: 4, y: 4, w: 2, h: 2 },
];

export default function DashboardGrid() {
  const [layout, setLayout] = useState<Layout>(initialLayout);

  const {
    width,
    containerRef,
    mounted,
  } = useContainerWidth({
    measureBeforeMount: true,
    initialWidth: 1400,
  });

  return (
    <div
      ref={containerRef}
      className="w-full"
    >
      {mounted && (
        <ReactGridLayout
          width={width}
          layout={layout}
          gridConfig={{
            cols: 6,
            rowHeight: 256,
            margin: [16, 16],
            containerPadding: [0, 0],
          }}
          dragConfig={{
            enabled: true,
            handle: ".widget-drag-handle",
          }}
          resizeConfig={{
            enabled: false,
          }}
          onLayoutChange={(newLayout) => {
            setLayout(newLayout);
          }}
        >
          <div key="weather-paris" className="h-full w-full">
            <WeatherSmallWidget
              city="Paris"
              temperature={18}
              condition="Cloudy"
              weatherCode={803}
            />
          </div>

          <div key="weather-tokyo" className="h-full w-full">
            <WeatherSmallWidget
              city="Tokyo"
              temperature={25}
              condition="Clear"
              weatherCode={800}
            />
          </div>

          <div key="weather-lyon" className="h-full w-full">
            <WeatherMediumWidget
              city="Lyon"
              temperature={19}
              condition="Cloudy"
              weatherCode={802}
            />
          </div>


          <div key="weather-sydney" className="h-full w-full">
            <WeatherLargeWidget
              city="Sydney"
              temperature={26}
              condition="Clear"
              weatherCode={800}
            />
          </div>


          <div key="weather-madrid" className="h-full w-full">
            <WeatherSmallWidget
              city="Madrid"
              temperature={27}
              condition="Clear"
              weatherCode={800}
            />
          </div>

          <div key="weather-stockholm" className="h-full w-full">
            <WeatherSmallWidget
              city="Stockholm"
              temperature={9}
              condition="Rain"
              weatherCode={500}
            />
          </div>

          <div key="weather-london" className="h-full w-full">
            <WeatherLargeWidget
              city="London"
              temperature={16}
              condition="Rain"
              weatherCode={500}
            />
          </div>
          <div key="weather-brussels" className="h-full w-full">
            <WeatherMediumWidget
              city="Brussels"
              temperature={15}
              condition="Rain"
              weatherCode={500}
            />
          </div>

          <div key="weather-oslo" className="h-full w-full">
            <WeatherSmallWidget
              city="Oslo"
              temperature={8}
              condition="Snow"
              weatherCode={601}
            />
          </div>

          <div key="weather-prague" className="h-full w-full">
            <WeatherSmallWidget
              city="Prague"
              temperature={15}
              condition="Cloudy"
              weatherCode={803}
            />
          </div>


        </ReactGridLayout>
      )}
    </div>
  );
}
