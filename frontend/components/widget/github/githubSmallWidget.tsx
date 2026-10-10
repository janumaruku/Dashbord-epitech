"use client";

import { useState } from "react";

import WidgetHeader from "@/components/widget/widgetHeader";
import WidgetFooter from "@/components/widget/widgetFooter";
import WidgetDeleteConfirm from "@/components/widget/widgetDeleteConfirm";
import GithubConfigModal, {
  type GithubConfig,
  type GithubWidgetType,
} from "@/components/widget/github/githubConfigModal";

type GithubSmallWidgetProps = {
  name: string;
  username: string;
  followers: number;
  publicRepos: number;

  widgetType: GithubWidgetType;
  refreshRate: number;
  onConfigSave: (config: GithubConfig) => void;
};

export default function GithubSmallWidget({
  name,
  username,
  followers,
  publicRepos,
  widgetType,
  refreshRate,
  onConfigSave,
}: GithubSmallWidgetProps) {
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

    console.log("Delete GitHub widget");
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
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-300 text-xl font-semibold text-zinc-950">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">
              {name}
            </p>

            <p className="truncate text-sm text-zinc-500">
              @{username}
            </p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-4 pt-3">
          <div>
            <p className="text-2xl font-semibold">
              {followers}
            </p>

            <p className="text-xs text-zinc-500">
              Followers
            </p>
          </div>

          <div>
            <p className="text-2xl font-semibold">
              {publicRepos}
            </p>

            <p className="text-xs text-zinc-500">
              Repos
            </p>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <WidgetFooter
          lastUpdated="3 min ago"
          sourceUrl={`https://github.com/${username}`}
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