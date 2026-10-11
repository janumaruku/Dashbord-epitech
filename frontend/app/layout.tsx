import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Epitech Dashboard",
  description:
    "A personal workspace for weather, repositories, and feeds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  );
}
