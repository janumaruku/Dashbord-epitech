"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Plug, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/services", label: "Services", icon: Plug },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string | null;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

type AppSidebarProps = {
  isMobileOpen: boolean;
  onMobileClose: () => void;
};

export default function AppSidebar({ isMobileOpen, onMobileClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden shrink-0 flex-col gap-3 border-r border-zinc-800 px-4 py-6 md:flex md:w-40 lg:w-[220px]">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
          Workspace
        </p>
        <NavLinks pathname={pathname} />
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col gap-3 bg-zinc-950 px-4 py-6">
            <div className="flex items-center justify-between px-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                Workspace
              </p>
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Close menu"
                className="text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
}
