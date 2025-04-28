import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";
import ThemeToggle from "@/components/theme/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Streaming UI",
  description: "This is a demonstration of streaming UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider defaultTheme="system">
          <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-3xl flex flex-col flex-1">
              <header className="flex items-center justify-between p-4 border-b">
                <h1 className="text-xl font-bold">Streaming UI</h1>
                <ThemeToggle />
              </header>

              <main className="flex-1 p-4 w-full">
                {children}
              </main>

            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
