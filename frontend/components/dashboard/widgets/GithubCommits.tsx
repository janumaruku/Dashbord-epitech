import type { GithubCommitsData } from "@/lib/githubWidgets";
import { formatRelativeTime } from "@/lib/time";

export default function GithubCommits({ data }: { data: GithubCommitsData }) {
  if (data.commits.length === 0) {
    return <p className="text-xs text-zinc-500">No commits found.</p>;
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
        {data.owner} / {data.repo}
      </p>

      <div className="flex flex-col gap-3">
        {data.commits.map((commit) => (
          <a
            key={commit.sha}
            href={commit.url}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col gap-0.5 hover:opacity-80"
          >
            <p className="truncate text-sm text-white">{commit.message}</p>
            <p className="text-xs text-zinc-500">
              {commit.author} · {formatRelativeTime(commit.date)}
              <span className="ml-2 font-mono text-zinc-600">{commit.sha}</span>
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
