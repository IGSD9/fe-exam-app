import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { BottomNav } from "@/components/layout/BottomNav";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/config";
import "./globals.css";

const sans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "基本情報技術者試験",
    "過去問",
    "FE",
    "無料",
    "問題集",
    "弱点復習",
  ],
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: { icon: "/favicon.svg" },
  appleWebApp: {
    capable: true,
    title: "FE過去問",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${sans.variable} antialiased`}>
        <div className="mx-auto min-h-dvh max-w-lg">
          <ServiceWorkerRegister />
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
