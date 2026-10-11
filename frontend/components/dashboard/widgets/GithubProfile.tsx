import type { GithubProfileData } from "@/lib/githubWidgets";

export default function GithubProfile({ data }: { data: GithubProfileData }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3">
        {data.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.avatar_url}
            alt={data.username}
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-300/20 text-sm font-semibold text-violet-300">
            {data.username.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div>
          <p className="text-sm font-semibold text-white">{data.name || data.username}</p>
          <p className="text-xs text-zinc-500">@{data.username}</p>
        </div>
      </div>

      {data.bio && <p className="text-xs text-zinc-400">{data.bio}</p>}

      <div className="flex items-center gap-4 text-sm">
        <div>
          <span className="font-semibold text-white">{data.followers}</span>{" "}
          <span className="text-zinc-500">Followers</span>
        </div>
        <div>
          <span className="font-semibold text-white">{data.public_repos}</span>{" "}
          <span className="text-zinc-500">Public repos</span>
        </div>
      </div>
    </div>
  );
}
