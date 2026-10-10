"use client";

import {
  Check,
  Clock3,
  CloudSun,
  Code2,
  Lock,
  Plus,
  ShieldCheck,
} from "lucide-react";

import Header from "@/components/dashboard/header";
import SideBar from "@/components/dashboard/sideBar";

import {
  type ServiceId,
  useServices,
} from "@/components/services/serviceContext";

type ServiceCardProps = {
  id: ServiceId;

  name: string;
  description: string;

  widgetCount: number;
  widgets: string[];

  authenticationRequired: boolean;

  subscribed: boolean;
  connected?: boolean;

  account?: string;

  icon: React.ReactNode;

  onSubscribe: () => void;
  onUnsubscribe: () => void;

  onConnect?: () => void;
  onDisconnect?: () => void;
};

export default function ServicesPage() {
  const {
    weatherSubscribed,
    githubSubscribed,
    githubConnected,
    clockSubscribed,

    subscribeService,
    unsubscribeService,

    connectGithub,
    disconnectGithub,
  } = useServices();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="xl:flex">
        <SideBar />

        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <div>
            <h1 className="text-2xl font-semibold">
              Services
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Manage the services
              available on your
              dashboard.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            <ServiceCard
              id="weather"
              name="Weather"
              description="Weather data, forecasts, and conditions for any city."
              widgetCount={3}
              widgets={[
                "Current weather",
                "Hourly forecast",
                "Full forecast",
              ]}
              authenticationRequired={
                false
              }
              subscribed={
                weatherSubscribed
              }
              icon={
                <CloudSun
                  size={24}
                />
              }
              onSubscribe={() =>
                subscribeService(
                  "weather"
                )
              }
              onUnsubscribe={() =>
                unsubscribeService(
                  "weather"
                )
              }
            />

            <ServiceCard
              id="github"
              name="GitHub"
              description="GitHub profiles, repositories, and recent commits."
              widgetCount={3}
              widgets={[
                "Profile",
                "Recent repositories",
                "Recent commits",
              ]}
              authenticationRequired
              subscribed={
                githubSubscribed
              }
              connected={
                githubConnected
              }
              account="alice_01"
              icon={
                <Code2
                  size={24}
                />
              }
              onSubscribe={() =>
                subscribeService(
                  "github"
                )
              }
              onUnsubscribe={() =>
                unsubscribeService(
                  "github"
                )
              }
              onConnect={
                connectGithub
              }
              onDisconnect={
                disconnectGithub
              }
            />

            <ServiceCard
              id="clock"
              name="Clock"
              description="Analog and digital clocks for cities around the world."
              widgetCount={2}
              widgets={[
                "Analog clock",
                "Digital clock",
              ]}
              authenticationRequired={
                false
              }
              subscribed={
                clockSubscribed
              }
              icon={
                <Clock3
                  size={24}
                />
              }
              onSubscribe={() =>
                subscribeService(
                  "clock"
                )
              }
              onUnsubscribe={() =>
                unsubscribeService(
                  "clock"
                )
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function ServiceCard({
  name,
  description,
  widgetCount,
  widgets,
  authenticationRequired,
  subscribed,
  connected = false,
  account,
  icon,
  onSubscribe,
  onUnsubscribe,
  onConnect,
  onDisconnect,
}: ServiceCardProps) {
  return (
    <article className="flex min-h-[420px] flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-200">
            {icon}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-medium text-zinc-100">
              {name}
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              {widgetCount} widget{" "}
              {widgetCount > 1
                ? "types"
                : "type"}
            </p>
          </div>
        </div>

        <ServiceStatus
          subscribed={
            subscribed
          }
          connected={
            connected
          }
          authenticationRequired={
            authenticationRequired
          }
        />
      </div>

      <p className="mt-5 text-sm leading-6 text-zinc-300">
        {description}
      </p>

      <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
          Available widgets
        </p>

        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-sm text-zinc-300">
          {widgets.map(
            (
              widget,
              index
            ) => (
              <span
                key={widget}
              >
                {widget}

                {index <
                  widgets.length -
                    1 && (
                  <span className="ml-2 text-zinc-700">
                    ·
                  </span>
                )}
              </span>
            )
          )}
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 text-sm text-zinc-500">
        {authenticationRequired ? (
          <Lock
            size={17}
            className="mt-0.5 shrink-0"
          />
        ) : (
          <ShieldCheck
            size={17}
            className="mt-0.5 shrink-0"
          />
        )}

        <p>
          {authenticationRequired
            ? connected
              ? `Authorized as @${account}.`
              : "GitHub authorization required."
            : "No external authentication required."}
        </p>
      </div>

      <div className="mt-3 min-h-10 text-sm leading-5 text-zinc-500">
        {authenticationRequired ? (
          connected ? (
            <p>
              Disconnect to remove
              access to your
              GitHub data.
            </p>
          ) : (
            <p>
              Connect your GitHub
              account to access
              repositories and
              commits.
            </p>
          )
        ) : name ===
          "Weather" ? (
          <p>
            Choose a city,
            widget type, units,
            and refresh rate when
            adding a widget.
          </p>
        ) : (
          <p>
            Choose a city,
            clock type, and time
            format when adding a
            widget.
          </p>
        )}
      </div>

      <div className="mt-auto border-t border-zinc-800 pt-5">
        {!subscribed ? (
          <button
            type="button"
            onClick={
              onSubscribe
            }
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-100 text-sm font-semibold text-zinc-950 transition hover:bg-white"
          >
            <Plus size={17} />

            Subscribe
          </button>
        ) : authenticationRequired ? (
          connected ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-2 text-sm font-medium text-zinc-300">
                <Check
                  size={17}
                />

                Connected
              </div>

              <button
                type="button"
                onClick={
                  onDisconnect
                }
                className="h-11 rounded-md border border-zinc-600 px-4 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={
                  onUnsubscribe
                }
                className="h-11 rounded-md border border-zinc-700 px-4 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
              >
                Unsubscribe
              </button>

              <button
                type="button"
                onClick={
                  onConnect
                }
                className="h-11 flex-1 rounded-md bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 hover:bg-white"
              >
                Connect
              </button>
            </div>
          )
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 text-sm font-medium text-zinc-300">
              <Check
                size={17}
              />

              Subscribed
            </div>

            <button
              type="button"
              onClick={
                onUnsubscribe
              }
              className="h-11 rounded-md border border-zinc-600 px-4 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
            >
              Unsubscribe
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function ServiceStatus({
  subscribed,
  connected,
  authenticationRequired,
}: {
  subscribed: boolean;
  connected: boolean;
  authenticationRequired: boolean;
}) {
  if (!subscribed) {
    return (
      <span className="whitespace-nowrap rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-500">
        Not subscribed
      </span>
    );
  }

  if (
    authenticationRequired &&
    !connected
  ) {
    return (
      <span className="whitespace-nowrap rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400">
        Not connected
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-950">
      <Check size={13} />

      {authenticationRequired
        ? "Connected"
        : "Subscribed"}
    </span>
  );
}