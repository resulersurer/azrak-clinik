import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://azrakclinic.com"),
  title: {
    default: "Azrak Klinik | İstanbul Saç Ekimi",
    template: "%s | Azrak Klinik",
  },
  description:
    "Azrak Klinik, İstanbul'da saç ekimi seçenekleri hakkında şeffaf bilgi ve kişiye özel ön görüşme sunar.",
  keywords: [
    "saç ekimi İstanbul",
    "İstanbul saç ekimi kliniği",
    "FUE saç ekimi",
    "DHI saç ekimi",
    "sakalı ekimi",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Azrak Klinik",
    title: "Azrak Klinik | İstanbul Saç Ekimi",
    description:
      "İstanbul'da saç ekimi seçenekleri için şeffaf bilgi ve kişiye özel ön görüşme.",
  },
  twitter: {
    card: "summary",
    title: "Azrak Klinik | İstanbul Saç Ekimi",
    description:
      "İstanbul'da saç ekimi seçenekleri için şeffaf bilgi ve kişiye özel ön görüşme.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
