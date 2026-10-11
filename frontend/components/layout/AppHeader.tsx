"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, Plus } from "lucide-react";
import { clearStoredUser, clearTokens, getStoredUser, type User } from "@/lib/auth";

function initialsOf(username: string) {
  return username.slice(0, 2).toUpperCase();
}

type AppHeaderProps = {
  onAddWidget?: () => void;
  onMenuToggle: () => void;
};

export default function AppHeader({ onAddWidget, onMenuToggle }: AppHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    clearTokens();
    clearStoredUser();
    router.push("/auth/login");
  }

  return (
    <header className="flex h-[71px] items-center justify-between border-b border-zinc-800 px-6">
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label="Open menu"
        className="text-zinc-400 hover:text-white md:hidden"
      >
        <Menu size={22} />
      </button>

      <Link href="/dashboard" className="hidden items-center gap-2.5 md:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">
          e_
        </span>
        <span className="text-[15px] font-semibold text-white">
          Epitech Dashboard
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={!onAddWidget}
          onClick={onAddWidget}
          title={onAddWidget ? undefined : "Add a widget from the dashboard."}
          className="hidden items-center gap-1.5 rounded-lg bg-blue-500 px-3.5 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 md:flex"
        >
          <Plus size={15} />
          Add widget
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full border border-zinc-800 py-1 pl-1 pr-2.5 hover:bg-zinc-900"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-300/20 text-[10px] font-semibold text-violet-300">
              {user ? initialsOf(user.username) : "··"}
            </span>
            <span className="text-[13px] text-white">
              {user?.username ?? ""}
            </span>
            <ChevronDown size={14} className="text-zinc-400" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-zinc-800 bg-zinc-900 p-1 shadow-xl">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
