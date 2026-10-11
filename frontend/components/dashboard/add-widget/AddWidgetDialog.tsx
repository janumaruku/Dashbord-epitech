"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import api from "@/lib/api";
import { useServices } from "@/hooks/useServices";
import { useWidgetCatalog } from "@/hooks/useWidgetCatalog";
import {
  defaultSizeFor,
  findFirstFreeArea,
  serviceDisplayName,
  type Position,
} from "@/lib/widgets";
import { isValidTimezone } from "@/lib/clock";
import StepService from "./StepService";
import StepWidgetType from "./StepWidgetType";
import StepConfigure from "./StepConfigure";
import StepPlacement from "./StepPlacement";
import type { ConfigValue, WizardState } from "./types";

const STEP_LABELS = ["Service", "Widget type", "Configure", "Placement"];

type AddWidgetDialogProps = {
  existingPositions: Position[];
  onClose: () => void;
  onCreated: () => void;
};

export default function AddWidgetDialog({
  existingPositions,
  onClose,
  onCreated,
}: AddWidgetDialogProps) {
  const { services } = useServices();
  const { widgets: catalog } = useWidgetCatalog();

  const [state, setState] = useState<WizardState>({
    step: 1,
    serviceId: null,
    widgetId: null,
    config: {},
    refreshRate: 300,
    position: { x: 0, y: 0, w: 4, h: 4 },
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Default selections are computed during render (not in an effect) so the
  // wizard works even if the user never explicitly clicks a service/widget.
  const effectiveServiceId =
    state.serviceId ?? services.find((service) => service.subscribed)?.id ?? null;
  const selectedService = services.find((s) => s.id === effectiveServiceId) ?? null;
  const serviceWidgets = useMemo(
    () => catalog.filter((widget) => widget.service_id === effectiveServiceId),
    [catalog, effectiveServiceId],
  );
  const effectiveWidgetId =
    (serviceWidgets.some((widget) => widget.id === state.widgetId)
      ? state.widgetId
      : serviceWidgets[0]?.id) ?? null;
  const selectedWidget = catalog.find((widget) => widget.id === effectiveWidgetId) ?? null;

  // Reset config/position synchronously during render when the effective
  // widget changes, per React's documented pattern for this case (avoids an
  // effect entirely): https://react.dev/learn/you-might-not-need-an-effect
  const [initializedWidgetId, setInitializedWidgetId] = useState<string | null>(null);
  if (selectedWidget && selectedWidget.id !== initializedWidgetId) {
    setInitializedWidgetId(selectedWidget.id);

    const config: Record<string, ConfigValue> = {};
    for (const param of selectedWidget.params) {
      config[param.name] = param.name === "units" ? "celsius" : "";
    }

    const size = defaultSizeFor(selectedWidget.name);
    const { x, y } = findFirstFreeArea(existingPositions, size.w, size.h);

    setState((current) => ({
      ...current,
      serviceId: effectiveServiceId,
      widgetId: selectedWidget.id,
      config,
      position: { x, y, w: size.w, h: size.h },
    }));
  }

  function isStepValid(step: number): boolean {
    if (step === 1) return Boolean(effectiveServiceId);
    if (step === 2) return Boolean(effectiveWidgetId);
    if (step === 3) {
      if (!selectedWidget) return false;
      return selectedWidget.params.every((param) => {
        const value = state.config[param.name];
        if (param.type === "integer") {
          return typeof value === "number" && Number.isFinite(value);
        }
        if (param.name === "timezone") {
          return typeof value === "string" && isValidTimezone(value);
        }
        return typeof value === "string" && value.trim().length > 0;
      });
    }
    if (step === 4) {
      const { x, y, w, h } = state.position;
      return x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 12;
    }
    return false;
  }

  function goNext() {
    setState((current) =>
      current.step < 4 ? { ...current, step: (current.step + 1) as WizardState["step"] } : current,
    );
  }

  function goBack() {
    setError("");
    setState((current) =>
      current.step > 1 ? { ...current, step: (current.step - 1) as WizardState["step"] } : current,
    );
  }

  async function handleSubmit() {
    if (!state.widgetId) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post("/dashboard/widgets", {
        widget_id: state.widgetId,
        config: state.config,
        refresh_rate: state.refreshRate,
        position: state.position,
      });
      onCreated();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err) && typeof err.response?.data?.message === "string") {
        setError(err.response.data.message);
      } else {
        setError("Could not add this widget. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const serviceLabel = selectedService ? serviceDisplayName(selectedService.name) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl bg-zinc-900 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
          Dashboard / Add widget / {state.step} of 4
        </p>

        <div className="mt-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Add widget</h1>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {STEP_LABELS.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber <= state.step;
            return (
              <div key={label} className="flex-1">
                <div
                  className={`h-0.5 rounded-full ${isActive ? "bg-blue-500" : "bg-zinc-800"}`}
                />
                <p
                  className={`mt-1.5 text-[11px] font-semibold ${
                    isActive ? "text-blue-300" : "text-zinc-600"
                  }`}
                >
                  {stepNumber} {label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 max-h-[55vh] overflow-y-auto border-t border-zinc-800 pt-6">
          {state.step === 1 && (
            <StepService
              services={services}
              catalog={catalog}
              serviceId={effectiveServiceId}
              onSelect={(serviceId) =>
                setState((current) =>
                  current.serviceId === serviceId
                    ? current
                    : { ...current, serviceId, widgetId: null },
                )
              }
            />
          )}

          {state.step === 2 && (
            <StepWidgetType
              serviceLabel={serviceLabel}
              widgets={serviceWidgets}
              widgetId={effectiveWidgetId}
              onSelect={(widgetId) => setState((current) => ({ ...current, widgetId }))}
            />
          )}

          {state.step === 3 && selectedWidget && (
            <StepConfigure
              serviceLabel={serviceLabel}
              widget={selectedWidget}
              config={state.config}
              onChange={(name, value) =>
                setState((current) => ({
                  ...current,
                  config: { ...current.config, [name]: value },
                }))
              }
            />
          )}

          {state.step === 4 && (
            <StepPlacement
              refreshRate={state.refreshRate}
              onRefreshRateChange={(refreshRate) =>
                setState((current) => ({ ...current, refreshRate }))
              }
              position={state.position}
              onPositionChange={(position) =>
                setState((current) => ({ ...current, position }))
              }
            />
          )}
        </div>

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

        <div className="mt-6 flex flex-col gap-2">
          {state.step > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="rounded-lg border border-zinc-700 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
            >
              Back
            </button>
          )}

          {state.step < 4 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!isStepValid(state.step)}
              className="rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isStepValid(4) || submitting}
              className="rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Adding…" : "Add to Dashboard"}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="py-1.5 text-center text-sm text-zinc-500 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
