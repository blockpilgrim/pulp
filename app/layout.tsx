import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "Pulp",
  description: "You write raw. AI pulps, provokes, presses.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Pulp",
    description: "You write raw. AI pulps, provokes, presses.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pulp",
    description: "You write raw. AI pulps, provokes, presses.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
