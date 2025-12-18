import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

