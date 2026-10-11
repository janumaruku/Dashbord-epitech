"use client";

import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import api from "@/lib/api";
import { isValidTimezone } from "@/lib/clock";
import type { WidgetInstance } from "@/hooks/useWidgetInstances";
import type { CatalogWidget } from "@/hooks/useWidgetCatalog";
import StepConfigure from "@/components/dashboard/add-widget/StepConfigure";
import type { ConfigValue } from "@/components/dashboard/add-widget/types";
import RefreshRateField from "@/components/dashboard/RefreshRateField";

type EditWidgetDialogProps = {
  instance: WidgetInstance;
  widget: CatalogWidget;
  serviceName: string;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditWidgetDialog({
  instance,
  widget,
  serviceName,
  onClose,
  onSaved,
}: EditWidgetDialogProps) {
  const [config, setConfig] = useState(
    instance.config as unknown as Record<string, ConfigValue>,
  );
  const [refreshRate, setRefreshRate] = useState(instance.refresh_rate);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isValid = widget.params.every((param) => {
    const value = config[param.name];
    if (param.type === "integer") {
      return typeof value === "number" && Number.isFinite(value);
    }
    if (param.name === "timezone") {
      return typeof value === "string" && isValidTimezone(value);
    }
    return typeof value === "string" && value.trim().length > 0;
  });

  async function handleSave() {
    setSubmitting(true);
    setError("");
    try {
      await api.put(`/dashboard/widgets/${instance.id}`, {
        config,
        refresh_rate: refreshRate,
      });
      onSaved();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err) && typeof err.response?.data?.message === "string") {
        setError(err.response.data.message);
      } else {
        setError("Could not save changes. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl bg-zinc-900 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Edit widget</h1>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex max-h-[55vh] flex-col gap-6 overflow-y-auto">
          <StepConfigure
            serviceLabel={serviceName}
            widget={widget}
            config={config}
            onChange={(name, value) =>
              setConfig((current) => ({ ...current, [name]: value }))
            }
          />
          <RefreshRateField value={refreshRate} onChange={setRefreshRate} />
        </div>

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid || submitting}
            className="rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save changes"}
          </button>
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
