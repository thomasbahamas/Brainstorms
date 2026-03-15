import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNIFIED Protocol — One App for Everything",
  description: "Personal operating system: crypto intelligence, content engine, finance, tasks, knowledge base, comms, macro analysis, health tracking — all in one unified protocol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

import { AppShell } from "@/components/unified/app-shell";
