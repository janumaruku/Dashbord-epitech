import type { ComponentType } from "react";
import { Clock, Cloud, Rss } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export const GRID_COLUMNS = 6;
export const ROW_HEIGHT = 88;
export const GRID_GAP = 16;
export const MIN_WIDGET_W = 2;
export const MIN_WIDGET_H = 2;

export type Position = { x: number; y: number; w: number; h: number };

export const DEFAULT_WIDGET_SIZE: Record<string, { w: number; h: number }> = {
  city_temperature: { w: 2, h: 4 },
  city_forecast: { w: 4, h: 4 },
  current_conditions: { w: 2, h: 4 },
  user_profile: { w: 2, h: 4 },
  recent_repos: { w: 3, h: 4 },
  recent_commits: { w: 3, h: 4 },
  feed_summary: { w: 2, h: 4 },
  feed_latest: { w: 6, h: 4 },
  analog_clock: { w: 3, h: 4 },
  digital_clock: { w: 3, h: 4 },
};

export function defaultSizeFor(widgetName: string): { w: number; h: number } {
  return DEFAULT_WIDGET_SIZE[widgetName] ?? { w: 2, h: 4 };
}

export function clampPosition(position: Position): Position {
  const w = Math.max(MIN_WIDGET_W, Math.min(position.w, GRID_COLUMNS));
  const h = Math.max(MIN_WIDGET_H, position.h);
  const x = Math.max(0, Math.min(position.x, GRID_COLUMNS - w));
  const y = Math.max(0, position.y);
  return { x, y, w, h };
}

const WIDGET_SERVICE: Record<string, string> = {
  city_temperature: "weather",
  city_forecast: "weather",
  current_conditions: "weather",
  user_profile: "github",
  recent_repos: "github",
  recent_commits: "github",
  feed_latest: "rss",
  feed_summary: "rss",
  analog_clock: "clock",
  digital_clock: "clock",
};

type ServiceAccent = {
  icon: ComponentType<{ size?: number }>;
  label: string;
  textClass: string;
};

const SERVICE_ACCENTS: Record<string, ServiceAccent> = {
  weather: { icon: Cloud, label: "Weather", textClass: "text-amber-400" },
  github: { icon: FaGithub, label: "GitHub", textClass: "text-violet-300" },
  rss: { icon: Rss, label: "RSS feeds", textClass: "text-orange-400" },
  clock: { icon: Clock, label: "Clock", textClass: "text-cyan-400" },
};

const FALLBACK_ACCENT: ServiceAccent = {
  icon: Clock,
  label: "Widget",
  textClass: "text-zinc-400",
};

export function accentForWidget(widgetName: string): ServiceAccent {
  const service = WIDGET_SERVICE[widgetName];
  return (service && SERVICE_ACCENTS[service]) || FALLBACK_ACCENT;
}

const WIDGET_TITLE_OVERRIDES: Record<string, string> = {
  feed_latest: "Latest articles",
  user_profile: "GitHub user profile",
};

export function titleForWidget(name: string): string {
  if (WIDGET_TITLE_OVERRIDES[name]) return WIDGET_TITLE_OVERRIDES[name];
  const spaced = name.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function isClockWidget(name: string | undefined): boolean {
  return name === "analog_clock" || name === "digital_clock";
}
