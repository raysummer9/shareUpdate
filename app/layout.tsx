import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Share Update - Marketplace MVP",
  description: "A marketplace MVP built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-liberation">
        {children}
      </body>
    </html>
  );
}

