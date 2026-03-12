import type { Metadata } from "next";
import localFont from "next/font/local";
import { Source_Serif_4 } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import "./globals.css";

const iaQuattro = localFont({
  src: [
    { path: "../fonts/iAWriterQuattroS-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/iAWriterQuattroS-Italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/iAWriterQuattroS-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/iAWriterQuattroS-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-quattro",
  display: "swap",
});

const iaMono = localFont({
  src: [
    { path: "../fonts/iAWriterMonoS-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/iAWriterMonoS-Italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/iAWriterMonoS-Bold.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-ia-mono",
  display: "swap",
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
  description: "Raw writing, sharp thinking.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Pulp",
    description: "Raw writing, sharp thinking.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pulp",
    description: "Raw writing, sharp thinking.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ClerkProvider must wrap <html> here (not inside providers.tsx) because it
    // must live in a Server Component and cannot be colocated with "use client".
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${iaQuattro.variable} ${iaMono.variable} ${sourceSerif.variable} antialiased`}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
