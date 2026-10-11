"use client";

import { useState, type ReactNode } from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";

type AppShellProps = {
  children: ReactNode;
  onAddWidget?: () => void;
};

export default function AppShell({ children, onAddWidget }: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <AppHeader onAddWidget={onAddWidget} onMenuToggle={() => setIsMobileNavOpen(true)} />
      <div className="flex min-w-0 flex-1">
        <AppSidebar
          isMobileOpen={isMobileNavOpen}
          onMobileClose={() => setIsMobileNavOpen(false)}
        />
        <main className="min-w-0 flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
