import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Script from "next/script";
import { getPlatformBaseUrl } from "@/lib/utils/public-urls";
import "./globals.css";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const defaultDescription =
  "Ստեղծեք արագ ռեստորանային կայք, բազմալեզու QR մենյու, պատվերների փորձ, SEO էջեր և analytics մեկ հարթակում։";

export const metadata: Metadata = {
  metadataBase: new URL(getPlatformBaseUrl()),
  applicationName: "Menurio",
  title: {
    default: "Menurio ռեստորանների համար",
    template: "%s - Menurio",
  },
  description: defaultDescription,
  keywords: [
    "restaurant website builder",
    "QR menu",
    "digital menu",
    "online restaurant orders",
    "multilingual menu",
    "restaurant SEO",
    "Menurio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Menurio",
    title: "Menurio ռեստորանների համար",
    description: defaultDescription,
    locale: "hy_AM",
  },
  twitter: {
    card: "summary_large_image",
    title: "Menurio ռեստորանների համար",
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF8F2" },
    { media: "(prefers-color-scheme: dark)", color: "#080B17" },
  ],
};

const themeInitializer = `
  (function () {
    try {
      var stored = localStorage.getItem("menurio-theme") || localStorage.getItem("webstile-theme");
      var theme = stored === "light" || stored === "dark"
        ? stored
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (_) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="hy"
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <Script id="menurio-theme" strategy="beforeInteractive">
          {themeInitializer}
        </Script>
      </body>
    </html>
  );
}
