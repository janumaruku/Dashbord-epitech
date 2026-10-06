import Link from "next/link";

export default function AddWidgetButton () {
    return (
         <Link
            href="/library"
            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700"
            aria-label="Ouvrir la librairie de widgets"
        >
            + Add Widget
        </Link>
    );
}