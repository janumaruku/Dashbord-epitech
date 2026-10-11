import { Check } from "lucide-react";
import type { CatalogWidget } from "@/hooks/useWidgetCatalog";
import { titleForWidget } from "@/lib/widgets";

type StepWidgetTypeProps = {
  serviceLabel: string;
  widgets: CatalogWidget[];
  widgetId: string | null;
  onSelect: (widgetId: string) => void;
};

export default function StepWidgetType({
  serviceLabel,
  widgets,
  widgetId,
  onSelect,
}: StepWidgetTypeProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-white">Choose a widget type</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Choose what you&apos;d like to see from {serviceLabel}.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {widgets.map((widget) => {
          const isSelected = widgetId === widget.id;

          return (
            <button
              key={widget.id}
              type="button"
              onClick={() => onSelect(widget.id)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors ${
                isSelected
                  ? "border-blue-500 bg-blue-500/5"
                  : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-white">
                  {titleForWidget(widget.name)}
                </p>
                <p className="text-xs text-zinc-400">{widget.description}</p>
              </div>

              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-zinc-700 text-transparent"
                }`}
              >
                <Check size={14} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
