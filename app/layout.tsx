import type { Metadata } from "next";
import Script from "next/script";
// @ts-ignore
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/layout/language-provider";
import {
  JsonLd,
  absoluteUrl,
  buildOrganizationSchema,
  buildRealEstateAgentSchema,
  buildWebSiteSchema,
  siteConfig
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: "Plots in Bangalore | Jaguar Properties",
    template: "%s | Jaguar Properties"
  },
  description:
    "Explore premium plots in Bangalore and North Bengaluru with Jaguar Properties. Discover residential plots, investment opportunities, and gated community developments.",
  metadataBase: new URL(siteConfig.baseUrl),
  applicationName: siteConfig.name,
  keywords: [...siteConfig.defaultKeywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: absoluteUrl("/")
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION
  },
  icons: {
    icon: "/uploads/site-media/jaguar-properties-logo.svg",
    apple: "/uploads/site-media/jaguar-properties-logo.svg"
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    title: "Plots in Bangalore | Jaguar Properties",
    description:
      "Explore premium plots in Bangalore and North Bengaluru with Jaguar Properties. Discover residential plots, investment opportunities, and gated community developments.",
    images: [
      {
        url: absoluteUrl(siteConfig.defaultOgImage),
        width: 1200,
        height: 630,
        alt: "Jaguar Properties premium plotted developments"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Plots in Bangalore | Jaguar Properties",
    description:
      "Explore premium plots in Bangalore and North Bengaluru with Jaguar Properties. Discover residential plots, investment opportunities, and gated community developments.",
    images: [absoluteUrl(siteConfig.defaultOgImage)]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <JsonLd
          data={[
            buildOrganizationSchema(),
            buildRealEstateAgentSchema(),
            buildWebSiteSchema()
          ]}
        />
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`}
            </Script>
          </>
        ) : null}
      </head>
      <body>
        <LanguageProvider>
          {children}
          <Toaster richColors position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
