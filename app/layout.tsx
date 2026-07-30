import type { Metadata } from "next";
import Script from "next/script";
// @ts-ignore
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/layout/language-provider";
import { getDirection } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import {
  JsonLd,
  absoluteUrl,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildRealEstateAgentSchema,
  buildWebSiteSchema,
  siteConfig
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: "Premium Residential Plots & Land Investment | Jaguar Properties",
    template: "%s | Jaguar Properties"
  },
  description:
    "Explore premium residential plots, investment plots, villa plots, gated community plots, and land investment opportunities in Bengaluru, Calicut, Qatar, and Dubai.",
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
    title: "Premium Residential Plots & Land Investment | Jaguar Properties",
    description:
      "Explore premium residential plots, investment plots, villa plots, gated community plots, and land investment opportunities in Bengaluru, Calicut, Qatar, and Dubai.",
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
    title: "Premium Residential Plots & Land Investment | Jaguar Properties",
    description:
      "Explore premium residential plots, investment plots, villa plots, gated community plots, and land investment opportunities in Bengaluru, Calicut, Qatar, and Dubai.",
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
  const locale = getRequestLocale();

  return (
    <html lang={locale} dir={getDirection(locale)} className="dark" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <JsonLd
          data={[
            buildOrganizationSchema(),
            buildLocalBusinessSchema(),
            buildRealEstateAgentSchema(),
            buildWebSiteSchema(locale)
          ]}
        />
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1508568194403939');
fbq('track', 'PageView');`}
        </Script>
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
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1508568194403939&ev=PageView&noscript=1"
          />
        </noscript>
        <LanguageProvider>
          {children}
          <Toaster richColors position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
