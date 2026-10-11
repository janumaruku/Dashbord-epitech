"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { useWidgetInstances } from "@/hooks/useWidgetInstances";
import { useWidgetCatalog } from "@/hooks/useWidgetCatalog";
import AppShell from "@/components/layout/AppShell";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import DashboardErrorState from "@/components/dashboard/DashboardErrorState";
import AddWidgetDialog from "@/components/dashboard/add-widget/AddWidgetDialog";

export default function DashboardPage() {
  const router = useRouter();
  const {
    instances,
    isLoading: instancesLoading,
    error: instancesError,
    refetch,
    updatePosition,
    deleteInstance,
  } = useWidgetInstances();
  const { widgets: catalog, isLoading: catalogLoading, error: catalogError } =
    useWidgetCatalog();
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/auth/login");
    }
  }, [router]);

  const isLoading = instancesLoading || catalogLoading;
  const error = instancesError || catalogError;

  const serviceCount = new Set(
    instances
      .map((instance) => catalog.find((w) => w.id === instance.widget_id)?.service_id)
      .filter((id): id is string => Boolean(id)),
  ).size;

  return (
    <AppShell onAddWidget={() => setIsAddWidgetOpen(true)}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
        Your workspace
      </p>
      <p className="mt-1 text-sm text-zinc-400">
        A clear view of your day, your work, and what&apos;s next.
      </p>

      {!isLoading && !error && instances.length > 0 && (
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
          {instances.length} widget{instances.length === 1 ? "" : "s"} /{" "}
          {serviceCount} service{serviceCount === 1 ? "" : "s"}
        </p>
      )}

      <div className="mt-6">
        {isLoading && <p className="text-sm text-zinc-400">Loading your dashboard…</p>}

        {!isLoading && error && <DashboardErrorState onRetry={refetch} />}

        {!isLoading && !error && instances.length === 0 && (
          <DashboardEmptyState onAddWidget={() => setIsAddWidgetOpen(true)} />
        )}

        {!isLoading && !error && instances.length > 0 && (
          <>
            <DashboardGrid
              instances={instances}
              catalog={catalog}
              onPositionChange={updatePosition}
              onDelete={deleteInstance}
              onRefetchDue={refetch}
            />
            <p className="mt-6 text-center text-xs text-zinc-600">
              Arrange your widgets using their drag handles. Use the options menu to edit
              or refresh a widget.
            </p>
          </>
        )}
      </div>

      {isAddWidgetOpen && (
        <AddWidgetDialog
          existingPositions={instances.map((instance) => instance.position)}
          onClose={() => setIsAddWidgetOpen(false)}
          onCreated={refetch}
        />
      )}
    </AppShell>
  );
}
