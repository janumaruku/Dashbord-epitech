"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { useServices } from "@/hooks/useServices";
import AppShell from "@/components/layout/AppShell";
import ServiceCard from "@/components/services/ServiceCard";

export default function ServicesPage() {
  const router = useRouter();
  const {
    services,
    isLoading,
    error,
    subscribingId,
    subscribe,
    unsubscribingId,
    unsubscribe,
  } = useServices();

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/auth/login");
    }
  }, [router]);

  const connectedCount = services.filter((service) => service.subscribed).length;

  return (
    <AppShell>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
        Your workspace
      </p>
      <h1 className="mt-2 text-[28px] font-bold text-white">Services</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Connect the sources you want to bring into your dashboard.
      </p>

      <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
        <span className="text-zinc-600">
          {services.length} available service{services.length === 1 ? "" : "s"}
        </span>
        <span className="text-green-400">{connectedCount} connected</span>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {isLoading && <p className="text-sm text-zinc-400">Loading services…</p>}

        {error && <p className="text-sm text-rose-400">{error}</p>}

        {!isLoading &&
          !error &&
          services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSubscribing={subscribingId === service.id}
              onSubscribe={subscribe}
              isUnsubscribing={unsubscribingId === service.id}
              onUnsubscribe={unsubscribe}
            />
          ))}
      </div>

      {!isLoading && !error && (
        <p className="mt-8 text-xs text-zinc-600">
          Subscribing makes a service&apos;s widgets available. Add a widget
          from the dashboard to choose its content and refresh rate.
        </p>
      )}
    </AppShell>
  );
}
