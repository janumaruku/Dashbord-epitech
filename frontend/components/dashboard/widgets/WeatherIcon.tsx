import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun } from "lucide-react";

type WeatherIconProps = {
  condition: string;
  size?: number;
  className?: string;
};

export default function WeatherIcon({ condition, size = 18, className }: WeatherIconProps) {
  const text = condition.toLowerCase();

  if (text.includes("thunder")) return <CloudLightning size={size} className={className} />;
  if (text.includes("drizzle")) return <CloudDrizzle size={size} className={className} />;
  if (text.includes("rain")) return <CloudRain size={size} className={className} />;
  if (text.includes("snow")) return <CloudSnow size={size} className={className} />;
  if (text.includes("fog") || text.includes("mist") || text.includes("haze")) {
    return <CloudFog size={size} className={className} />;
  }
  if (text.includes("clear") || text.includes("sun")) return <Sun size={size} className={className} />;

  return <Cloud size={size} className={className} />;
}
