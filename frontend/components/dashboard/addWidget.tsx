import Link from "next/link";

type AddWidgetButtonProps = {
  compact?: boolean;
};

export default function AddWidgetButton({
  compact = false,
}: AddWidgetButtonProps) {
  return (
    <Link
      href="/library"
      aria-label="Add widget"
      className={
        compact
          ? "flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-xl font-medium text-zinc-100 hover:bg-zinc-700"
          : "rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700"
      }
    >
      {compact ? "+" : "+ Add Widget"}
    </Link>
  );
}