"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Boxes } from "lucide-react";

export default function SideBar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-zinc-800 bg-zinc-950 p-3 xl:block">
        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
              pathname === "/"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/services"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
              pathname === "/services"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <Boxes size={18} />
            Services
          </Link>
        </nav>
      </aside>

      <nav className="flex border-b border-zinc-800 px-4 py-2 xl:hidden">
        <Link
          href="/"
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm ${
            pathname === "/"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400"
          }`}
        >
          <LayoutDashboard size={17} />
          Dashboard
        </Link>

        <Link
          href="/services"
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm ${
            pathname === "/services"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400"
          }`}
        >
          <Boxes size={17} />
          Services
        </Link>
      </nav>
    </>
  );
}