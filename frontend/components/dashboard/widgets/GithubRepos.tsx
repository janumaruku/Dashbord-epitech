import { Star } from "lucide-react";
import type { GithubReposData } from "@/lib/githubWidgets";

export default function GithubRepos({ data }: { data: GithubReposData }) {
  if (data.repos.length === 0) {
    return <p className="text-xs text-zinc-500">No repositories found.</p>;
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
        {data.username} / recent work
      </p>

      <div className="flex flex-col gap-3">
        {data.repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-start justify-between gap-3 hover:opacity-80"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-blue-300">{repo.name}</p>
              {repo.description && (
                <p className="truncate text-xs text-zinc-500">{repo.description}</p>
              )}
              {repo.language && (
                <p className="mt-0.5 text-[11px] text-zinc-600">{repo.language}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1 text-xs text-zinc-400">
              <Star size={12} />
              {repo.stars}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
