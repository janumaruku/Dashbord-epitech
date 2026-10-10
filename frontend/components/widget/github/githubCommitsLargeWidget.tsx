"use client";

import { useState } from "react";
import { GitCommitHorizontal } from "lucide-react";

import WidgetHeader from "@/components/widget/widgetHeader";
import WidgetFooter from "@/components/widget/widgetFooter";
import WidgetDeleteConfirm from "@/components/widget/widgetDeleteConfirm";

type GithubCommit = {
  message: string;
  author: string;
  timeAgo: string;
  hash: string;
  url: string;
};

type GithubCommitsLargeWidgetProps = {
  username: string;
  repository: string;
  commits: GithubCommit[];
};

export default function GithubCommitsLargeWidget({
  username,
  repository,
  commits,
}: GithubCommitsLargeWidgetProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function configureWidget() {
    console.log("Configure GitHub commits widget");
  }

  function openDeleteConfirm() {
    setMenuOpen(false);
    setDeleteOpen(true);
  }

  function closeDeleteConfirm() {
    setDeleteOpen(false);
  }

  function backToMenu() {
    setDeleteOpen(false);
    setMenuOpen(true);
  }

  function confirmDelete() {
    setDeleteOpen(false);

    console.log("Delete GitHub commits widget");
  }

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-white">
      <div className="shrink-0">
        <WidgetHeader
          title="GITHUB"
          onConfigure={configureWidget}
          onDelete={openDeleteConfirm}
          menuOpen={menuOpen}
          onMenuOpenChange={setMenuOpen}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
        <p className="mb-4 text-sm text-zinc-500">
          @{username} / {repository}
        </p>

        <div className="flex flex-1 flex-col gap-5">
          {commits.slice(0, 4).map((commit) => (
            <div
              key={commit.hash}
              className="flex gap-3"
            >
              <div className="pt-1">
                <GitCommitHorizontal
                  size={20}
                  className="text-violet-300"
                />
              </div>

              <div className="min-w-0 flex-1">
                <a
                  href={commit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-base font-medium text-zinc-100 hover:underline"
                >
                  {commit.message}
                </a>

                <p className="mt-1 text-sm text-zinc-500">
                  {commit.author} · {commit.timeAgo}
                </p>

                <p className="mt-1 font-mono text-xs text-zinc-600">
                  {commit.hash}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0">
        <WidgetFooter
          lastUpdated="3 min ago"
          sourceUrl={`https://github.com/${username}/${repository}/commits`}
          sourceName="GitHub"
        />
      </div>

      {deleteOpen && (
        <WidgetDeleteConfirm
          onBack={backToMenu}
          onClose={closeDeleteConfirm}
          onConfirm={confirmDelete}
        />
      )}
    </article>
  );
}