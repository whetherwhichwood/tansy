import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keeper - Home & Life Upkeep Tracker",
  description: "Never forget what needs fixing, renewing, or replacing again. Track warranties, maintenance tasks, and document renewals in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
