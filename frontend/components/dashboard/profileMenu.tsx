"use client";

import { useEffect, useRef, useState } from "react";
import { User, LogOut, Users } from "lucide-react";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
      >
        <User size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-zinc-700 bg-zinc-950 p-3 shadow-xl">
          <p className="px-2 pb-2 text-sm font-semibold text-zinc-300">
            Account
          </p>

          <div className="flex items-center gap-3 rounded-lg px-2 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800">
              <User size={20} className="text-zinc-300" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-medium text-white">
                albane.heraud
              </p>

              <p className="truncate text-sm text-zinc-400">
                albane.heraud@epitech.eu
              </p>
            </div>
          </div>

          <div className="my-2 border-t border-zinc-800" />

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800"
          >
            <Users size={17} className="text-zinc-400" />
            Switch account
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800"
          >
            <LogOut size={17} className="text-zinc-400" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}