import type { Position } from "@/lib/widgets";

export type ConfigValue = string | number;

export type WizardState = {
  step: 1 | 2 | 3 | 4;
  serviceId: string | null;
  widgetId: string | null;
  config: Record<string, ConfigValue>;
  refreshRate: number;
  position: Position;
};
