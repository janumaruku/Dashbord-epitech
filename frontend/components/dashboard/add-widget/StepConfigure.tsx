import type { CatalogWidget, WidgetParam } from "@/hooks/useWidgetCatalog";
import { rangeHintFor, titleForWidget } from "@/lib/widgets";
import type { ConfigValue } from "./types";

type StepConfigureProps = {
  serviceLabel: string;
  widget: CatalogWidget;
  config: Record<string, ConfigValue>;
  onChange: (name: string, value: ConfigValue) => void;
};

function labelFor(param: WidgetParam) {
  return param.name.charAt(0).toUpperCase() + param.name.slice(1).replace(/_/g, " ");
}

function Field({ param, widget, config, onChange }: {
  param: WidgetParam;
  widget: CatalogWidget;
  config: Record<string, ConfigValue>;
  onChange: (name: string, value: ConfigValue) => void;
}) {
  const value = config[param.name];

  if (param.name === "units") {
    return (
      <select
        value={typeof value === "string" ? value : "celsius"}
        onChange={(event) => onChange(param.name, event.target.value)}
        className="w-full rounded-lg border border-zinc-800 bg-black px-3.5 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
      >
        <option value="celsius">Celsius (°C)</option>
        <option value="fahrenheit">Fahrenheit (°F)</option>
      </select>
    );
  }

  if (param.type === "integer") {
    const { min, max } = rangeHintFor(widget.name, param.name);
    return (
      <input
        type="number"
        min={min}
        max={max}
        value={typeof value === "number" ? value : ""}
        onChange={(event) => onChange(param.name, Number(event.target.value))}
        className="w-full rounded-lg border border-zinc-800 bg-black px-3.5 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
      />
    );
  }

  return (
    <input
      type={param.name === "feed_url" ? "url" : "text"}
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(param.name, event.target.value)}
      placeholder={param.name === "feed_url" ? "https://example.com/feed.xml" : ""}
      className="w-full rounded-lg border border-zinc-800 bg-black px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
    />
  );
}

export default function StepConfigure({
  serviceLabel,
  widget,
  config,
  onChange,
}: StepConfigureProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-white">Configure your widget</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Fill in the details {titleForWidget(widget.name).toLowerCase()} needs.
        </p>
      </div>

      <span className="w-fit rounded-md bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
        {serviceLabel} / {titleForWidget(widget.name)}
      </span>

      <div className="flex flex-col gap-4">
        {widget.params.map((param) => (
          <div key={param.name} className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-300">{labelFor(param)} · required</label>
            <Field param={param} widget={widget} config={config} onChange={onChange} />
            <p className="text-xs text-zinc-600">{param.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
