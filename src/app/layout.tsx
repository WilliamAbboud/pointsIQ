import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PointsIQ — Loyalty Portfolio Tracker",
  description:
    "Your entire loyalty portfolio, finally worth what it should be.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
