import type { ReactNode } from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";

type AppShellProps = {
  children: ReactNode;
  onAddWidget?: () => void;
};

export default function AppShell({ children, onAddWidget }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <AppHeader onAddWidget={onAddWidget} />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
