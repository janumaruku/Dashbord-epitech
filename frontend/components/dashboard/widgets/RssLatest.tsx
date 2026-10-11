import { ExternalLink } from "lucide-react";
import type { RssLatestData } from "@/lib/rssWidgets";
import { formatRelativeTime } from "@/lib/time";

export default function RssLatest({ data }: { data: RssLatestData }) {
  if (data.articles.length === 0) {
    return <p className="text-xs text-zinc-500">No articles found.</p>;
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{data.feed_title}</p>
        <p className="text-xs text-zinc-500">Latest {data.articles.length}</p>
      </div>

      <div className="flex flex-col gap-3">
        {data.articles.map((article) => (
          <a
            key={article.link}
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="flex items-start justify-between gap-2 hover:opacity-80"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-white">{article.title}</p>
              <p className="text-xs text-zinc-500">{formatRelativeTime(article.pub_date)}</p>
            </div>
            <ExternalLink size={12} className="mt-1 shrink-0 text-zinc-600" />
          </a>
        ))}
      </div>
    </div>
  );
}
