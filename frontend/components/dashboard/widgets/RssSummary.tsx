import { feedDomain, type RssSummaryData } from "@/lib/rssWidgets";

export default function RssSummary({
  data,
  feedUrl,
}: {
  data: RssSummaryData;
  feedUrl: string;
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-sm font-semibold text-white">{data.title}</p>

      {data.description && <p className="text-xs text-zinc-400">{data.description}</p>}

      <div>
        <span className="text-3xl font-bold text-white">{data.article_count}</span>{" "}
        <span className="text-sm text-zinc-500">articles in this feed</span>
      </div>

      <p className="text-xs text-blue-300">{feedDomain(feedUrl)}</p>
    </div>
  );
}
