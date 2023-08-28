import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

import TopBar from "@/components/layouts/top-bar";
import FloatingNavbar from "@/components/layouts/floating-navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "UKS",
  title: "POSKESTREN MANAGEMENT",
  description: "management for poskestren amtsilati",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "POSKESTREN MANAGEMENT",
    // startUpImage: [],
  },
  icons: [
    { rel: "icon", url: "/icon-192x192.png" },
    { rel: "apple-touch-icon", url: "/icon-192x192.png" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TopBar />
          <main className="p-2 pb-14 md:pb-0">{children}</main>
          <Toaster />
          <FloatingNavbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
