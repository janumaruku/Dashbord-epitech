import { Check, Lock } from "lucide-react";
import type { Service } from "@/hooks/useServices";
import type { CatalogWidget } from "@/hooks/useWidgetCatalog";
import { serviceDisplayName } from "@/lib/widgets";

const SERVICE_SWATCH: Record<string, string> = {
  weather: "bg-amber-400",
  github: "bg-violet-300",
  rss: "bg-orange-400",
  clock: "bg-cyan-400",
};

const SERVICE_BLURB: Record<string, string> = {
  weather: "Temperature, forecasts, and conditions",
  github: "Profiles, repositories, and commits",
  rss: "Latest articles and feed summaries",
  clock: "Analog and digital clocks for any timezone",
};

type StepServiceProps = {
  services: Service[];
  catalog: CatalogWidget[];
  serviceId: string | null;
  onSelect: (serviceId: string) => void;
};

export default function StepService({
  services,
  catalog,
  serviceId,
  onSelect,
}: StepServiceProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-white">Choose a service</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Widgets are available for the services you subscribe to.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {services.map((service) => {
          const isSelected = serviceId === service.id;
          const widgetCount = catalog.filter(
            (widget) => widget.service_id === service.id,
          ).length;

          return (
            <button
              key={service.id}
              type="button"
              disabled={!service.subscribed}
              onClick={() => onSelect(service.id)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors ${
                isSelected
                  ? "border-blue-500 bg-blue-500/5"
                  : "border-zinc-800 hover:border-zinc-700"
              } ${!service.subscribed ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-9 w-9 rounded-lg ${SERVICE_SWATCH[service.name] ?? "bg-zinc-600"}`}
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {serviceDisplayName(service.name)}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {SERVICE_BLURB[service.name] ?? service.description}
                  </p>
                  <p className="mt-0.5 text-xs text-blue-300">
                    {service.subscribed
                      ? `Subscribed · ${widgetCount} widget type${widgetCount === 1 ? "" : "s"}`
                      : "Subscribe first"}
                  </p>
                </div>
              </div>

              {service.subscribed ? (
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-zinc-700 text-transparent"
                  }`}
                >
                  <Check size={14} />
                </span>
              ) : (
                <Lock size={16} className="text-zinc-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
