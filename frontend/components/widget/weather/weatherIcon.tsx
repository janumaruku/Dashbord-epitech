import Image from "next/image";

import clearDay from "@meteocons/svg-static/fill/clear-day.svg";
import cloudy from "@meteocons/svg-static/fill/cloudy.svg";
import partlyCloudyDay from "@meteocons/svg-static/fill/partly-cloudy-day.svg";
import rain from "@meteocons/svg-static/fill/rain.svg";
import drizzle from "@meteocons/svg-static/fill/drizzle.svg";
import thunderstorms from "@meteocons/svg-static/fill/thunderstorms.svg";
import snow from "@meteocons/svg-static/fill/snow.svg";
import mist from "@meteocons/svg-static/fill/mist.svg";

type WeatherIconProps = {
  weatherCode: number;
  size?: number;
};

export default function WeatherIcon({
  weatherCode,
  size = 70,
}: WeatherIconProps) {
  function getWeatherIcon(code: number) {
    if (code >= 200 && code < 300) {
      return thunderstorms;
    }

    if (code >= 300 && code < 400) {
      return drizzle;
    }

    if (code >= 500 && code < 600) {
      return rain;
    }

    if (code >= 600 && code < 700) {
      return snow;
    }

    if (code >= 700 && code < 800) {
      return mist;
    }

    if (code === 800) {
      return clearDay;
    }

    if (code === 801 || code === 802) {
      return partlyCloudyDay;
    }

    if (code >= 803 && code < 900) {
      return cloudy;
    }

    return cloudy;
  }

  const icon = getWeatherIcon(weatherCode);

  return (
    <Image
      src={icon}
      alt="Weather condition"
      width={size}
      height={size}
    />
  );
}
