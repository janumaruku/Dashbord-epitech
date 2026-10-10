"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import WidgetHeader from "@/components/widget/widgetHeader";
import WidgetFooter from "@/components/widget/widgetFooter";
import WidgetDeleteConfirm from "@/components/widget/widgetDeleteConfirm";

import GithubConfigModal, {
  type GithubConfig,
  type GithubWidgetType,
} from "@/components/widget/github/githubConfigModal";

type GithubRepository = {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
};

type GithubLargeWidgetProps = {
  username: string;
  repositories: GithubRepository[];

  widgetType: GithubWidgetType;
  refreshRate: number;

  onConfigSave: (config: GithubConfig) => void;
  onDelete: () => void;
};

export default function GithubLargeWidget({
  username,
  repositories,
  widgetType,
  refreshRate,
  onConfigSave,
  onDelete,
}: GithubLargeWidgetProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  function openConfig() {
    setMenuOpen(false);
    setConfigOpen(true);
  }

  function closeConfig() {
    setConfigOpen(false);
  }

  function backToMenuFromConfig() {
    setConfigOpen(false);
    setMenuOpen(true);
  }

  function saveConfig(config: GithubConfig) {
    onConfigSave(config);
    setConfigOpen(false);
  }

  function openDeleteConfirm() {
    setMenuOpen(false);
    setDeleteOpen(true);
  }

  function closeDeleteConfirm() {
    setDeleteOpen(false);
  }

  function backToMenuFromDelete() {
    setDeleteOpen(false);
    setMenuOpen(true);
  }

  function confirmDelete() {
    setDeleteOpen(false);
    onDelete();
  }

  function renderRepository(
    repository: GithubRepository
  ) {
    return (
      <div
        key={repository.name}
        className="py-3 first:pt-0"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-base font-semibold text-blue-400 hover:underline"
            >
              {repository.name}
            </a>

            <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-400">
              {repository.description}
            </p>

            <p className="mt-2 text-xs text-violet-300">
              {repository.language}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1 text-zinc-400">
            <Star size={16} />

            <span className="text-sm">
              {repository.stars}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-white">
      <div className="shrink-0">
        <WidgetHeader
          title="GITHUB"
          onConfigure={openConfig}
          onDelete={openDeleteConfirm}
          menuOpen={menuOpen}
          onMenuOpenChange={setMenuOpen}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
        <p className="mb-3 text-sm text-zinc-500">
          @{username} / Recent repositories
        </p>

        <div className="divide-y divide-zinc-800 sm:hidden">
          {repositories
            .slice(0, 3)
            .map(renderRepository)}
        </div>

        <div className="hidden divide-y divide-zinc-800 sm:block">
          {repositories
            .slice(0, 4)
            .map(renderRepository)}
        </div>
      </div>

      <div className="shrink-0">
        <WidgetFooter
          lastUpdated="3 min ago"
          sourceUrl={`https://github.com/${username}?tab=repositories`}
          sourceName="GitHub"
        />
      </div>

      {configOpen && (
        <GithubConfigModal
          widgetType={widgetType}
          refreshRate={refreshRate}
          username={username}
          onBack={backToMenuFromConfig}
          onClose={closeConfig}
          onSave={saveConfig}
        />
      )}

      {deleteOpen && (
        <WidgetDeleteConfirm
          onBack={backToMenuFromDelete}
          onClose={closeDeleteConfirm}
          onConfirm={confirmDelete}
        />
      )}
    </article>
  );
}