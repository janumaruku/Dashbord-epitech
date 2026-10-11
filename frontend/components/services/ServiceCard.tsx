"use client";

import { useState, type ComponentType } from "react";
import { Clock, Cloud, Plug, Rss } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { startGithubConnect } from "@/lib/github";
import type { Service } from "@/hooks/useServices";

type ServiceMeta = {
  icon: ComponentType<{ size?: number }>;
  accent: string;
  widgetTypesLabel: string;
  widgetsList: string;
  authNote: string;
  subscribeNote: string;
};

const SERVICE_META: Record<string, ServiceMeta> = {
  weather: {
    icon: Cloud,
    accent: "text-amber-400 bg-amber-400/10",
    widgetTypesLabel: "3 widget types",
    widgetsList: "City temperature · City forecast · Current conditions",
    authNote: "No external authentication required",
    subscribeNote: "Choose a city and units when you add a widget.",
  },
  github: {
    icon: FaGithub,
    accent: "text-violet-300 bg-violet-300/10",
    widgetTypesLabel: "3 widget types",
    widgetsList: "User profile · Recent repositories · Recent commits",
    authNote: "GitHub authorization required",
    subscribeNote: "You'll be taken to GitHub to authorize your connection.",
  },
  rss: {
    icon: Rss,
    accent: "text-orange-400 bg-orange-400/10",
    widgetTypesLabel: "2 widget types",
    widgetsList: "Latest articles · Feed summary",
    authNote: "No external authentication required",
    subscribeNote: "Feed URLs are configured per widget. No URL is needed to subscribe.",
  },
  clock: {
    icon: Clock,
    accent: "text-cyan-400 bg-cyan-400/10",
    widgetTypesLabel: "2 widget types",
    widgetsList: "Analog clock · Digital clock",
    authNote: "No external authentication required",
    subscribeNote: "Choose a city or timezone when you add a widget.",
  },
};

const FALLBACK_META: ServiceMeta = {
  icon: Plug,
  accent: "text-zinc-400 bg-zinc-400/10",
  widgetTypesLabel: "",
  widgetsList: "",
  authNote: "",
  subscribeNote: "",
};

type ServiceCardProps = {
  service: Service;
  isSubscribing: boolean;
  onSubscribe: (serviceId: string) => void;
  isUnsubscribing: boolean;
  onUnsubscribe: (serviceId: string) => void;
};

export default function ServiceCard({
  service,
  isSubscribing,
  onSubscribe,
  isUnsubscribing,
  onUnsubscribe,
}: ServiceCardProps) {
  const [githubError, setGithubError] = useState("");
  const meta = SERVICE_META[service.name] ?? FALLBACK_META;
  const Icon = meta.icon;
  const isOAuth = service.oauth_provider === "github";

  function handleConnectGithub() {
    try {
      startGithubConnect();
    } catch {
      setGithubError("GitHub connection isn't configured yet.");
    }
  }

  return (
    <div className="rounded-2xl bg-zinc-900 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${meta.accent}`}>
            <Icon size={20} />
          </span>
          <div>
            <p className="text-lg font-semibold text-white">{service.name}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-600">
              {meta.widgetTypesLabel}
            </p>
          </div>
        </div>

        <p
          className={`text-[11px] font-semibold ${
            service.subscribed ? "text-green-400" : "text-zinc-400"
          }`}
        >
          {service.subscribed
            ? "Subscribed"
            : isOAuth
              ? "Not connected"
              : "Not subscribed"}
        </p>
      </div>

      <p className="mt-4 text-[15px] text-zinc-300">{service.description}</p>

      <div className="mt-4 flex flex-col gap-1.5 border-t border-zinc-800 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
          Available widgets
        </p>
        <p className="text-[13px] text-zinc-300">{meta.widgetsList}</p>
        <p className="text-xs text-zinc-500">{meta.authNote}</p>
        <p className="text-xs text-zinc-500">{meta.subscribeNote}</p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        {service.subscribed ? (
          <>
            <span className="rounded-lg bg-zinc-800 px-3.5 py-2 text-[13px] font-semibold text-zinc-300">
              Connected
            </span>
            <button
              type="button"
              onClick={() => onUnsubscribe(service.id)}
              disabled={isUnsubscribing}
              className="text-[13px] font-semibold text-rose-400 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUnsubscribing ? "Disconnecting…" : "Disconnect"}
            </button>
          </>
        ) : isOAuth ? (
          <button
            type="button"
            onClick={handleConnectGithub}
            className="rounded-lg bg-blue-500 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-blue-400"
          >
            Connect GitHub
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSubscribe(service.id)}
            disabled={isSubscribing}
            className="rounded-lg bg-blue-500 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-blue-400 disabled:opacity-50"
          >
            {isSubscribing ? "Subscribing…" : "Subscribe"}
          </button>
        )}
      </div>

      {githubError && (
        <p className="mt-2 text-xs text-rose-400">{githubError}</p>
      )}
    </div>
  );
}
