import { ExternalLink } from "lucide-react";

type WidgetFooterProps = {
  lastUpdated: string;
  sourceUrl: string;
  sourceName: string;
};

export default function WidgetFooter({
  lastUpdated,
  sourceUrl,
  sourceName,
}: WidgetFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-zinc-800 px-3 py-2">
      <p className="text-xs text-zinc-500">
        Last updated: {lastUpdated}
      </p>

      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white"
        aria-label={`Open ${sourceName}`}
      >
        <ExternalLink size={15} />
      </a>
    </div>
  );
}