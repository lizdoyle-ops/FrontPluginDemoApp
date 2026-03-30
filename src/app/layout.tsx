import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DemoConfigProvider } from "@/hooks/useDemoConfig";
import { PluginShell } from "@/components/layout/PluginShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reapit Property Management — Front Plugin",
  description: "Property management sidebar for Front",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-100">
        <DemoConfigProvider>
          <PluginShell>{children}</PluginShell>
        </DemoConfigProvider>
      </body>
    </html>
  );
}
