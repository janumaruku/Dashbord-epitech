import type { Metadata } from "next";

import "./globals.css";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import {
  ServiceProvider,
} from "@/components/services/serviceContext";

export const metadata: Metadata = {
  title: "My Dashboard",
  description:
    "A customizable dashboard with weather, GitHub, and clock widgets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-white">
        <ServiceProvider>
          {children}
        </ServiceProvider>
      </body>
    </html>
  );
}