"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, X } from "lucide-react";

export type GithubWidgetType =
  | "profile"
  | "repositories"
  | "commits";

export type GithubConfig = {
  widgetType: GithubWidgetType;
  refreshRate: number;
  repository?: string;
};

type GithubConfigModalProps = {
  widgetType: GithubWidgetType;
  refreshRate: number;
  repository?: string;
  username: string;

  onBack: () => void;
  onClose: () => void;
  onSave: (config: GithubConfig) => void;
};

function subscribe() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export default function GithubConfigModal({
  widgetType,
  refreshRate,
  repository,
  username,
  onBack,
  onClose,
  onSave,
}: GithubConfigModalProps) {
  const isClient = useIsClient();

  const [newWidgetType, setNewWidgetType] =
    useState<GithubWidgetType>(widgetType);

  const [newRefreshRate, setNewRefreshRate] =
    useState(refreshRate);

  const [newRepository, setNewRepository] =
    useState(repository ?? "epitech-dashboard");

  function handleSave() {
    if (
      newWidgetType === "commits" &&
      !newRepository.trim()
    ) {
      return;
    }

    onSave({
      widgetType: newWidgetType,
      refreshRate: newRefreshRate,
      repository:
        newWidgetType === "commits"
          ? newRepository
          : undefined,
    });
  }

  if (!isClient) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="github-config-title"
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid grid-cols-[40px_1fr_40px] items-center border-b border-zinc-800 px-5 py-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <h2
            id="github-config-title"
            className="text-center text-xl font-semibold"
          >
            Edit widget
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-6 text-base font-semibold tracking-wide text-zinc-200">
            GITHUB
          </p>

          <div>
            <p className="mb-2 text-sm font-medium text-zinc-300">
              Widget type
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  setNewWidgetType("profile")
                }
                className={`rounded-md border px-4 py-3 text-sm ${
                  newWidgetType === "profile"
                    ? "border-zinc-500 bg-zinc-800 text-white"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                Profile
              </button>

              <button
                type="button"
                onClick={() =>
                  setNewWidgetType("repositories")
                }
                className={`rounded-md border px-4 py-3 text-sm ${
                  newWidgetType === "repositories"
                    ? "border-zinc-500 bg-zinc-800 text-white"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                Repositories
              </button>

              <button
                type="button"
                onClick={() =>
                  setNewWidgetType("commits")
                }
                className={`rounded-md border px-4 py-3 text-sm ${
                  newWidgetType === "commits"
                    ? "border-zinc-500 bg-zinc-800 text-white"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                Commits
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-300">
                GitHub account
              </p>

              <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-zinc-400">
                @{username}
              </div>
            </div>

            <div>
              <label
                htmlFor="github-refresh-rate"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Refresh rate
              </label>

              <select
                id="github-refresh-rate"
                value={newRefreshRate}
                onChange={(event) =>
                  setNewRefreshRate(
                    Number(event.target.value)
                  )
                }
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-zinc-500"
              >
                <option value={1}>Every minute</option>
                <option value={5}>Every 5 minutes</option>
                <option value={10}>Every 10 minutes</option>
                <option value={15}>Every 15 minutes</option>
                <option value={30}>Every 30 minutes</option>
                <option value={60}>Every hour</option>
              </select>
            </div>
          </div>

          {newWidgetType === "commits" && (
            <div className="mt-6">
              <label
                htmlFor="github-repository"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Repository
              </label>

              <select
                id="github-repository"
                value={newRepository}
                onChange={(event) =>
                  setNewRepository(event.target.value)
                }
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-zinc-500"
              >
                <option value="epitech-dashboard">
                  epitech-dashboard
                </option>

                <option value="go-weather-client">
                  go-weather-client
                </option>

                <option value="rss-reader">
                  rss-reader
                </option>

                <option value="portfolio">
                  portfolio
                </option>
              </select>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 border-t border-zinc-800 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black hover:bg-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}