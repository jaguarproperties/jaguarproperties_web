import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/layout/language-provider";
import { siteMedia } from "@/lib/site-media";

export const metadata: Metadata = {
  title: {
    default: "Jaguar Properties | Luxury Real Estate in Bengaluru, Qatar & Dubai",
    template: "%s | Jaguar Properties"
  },
  description:
    "Jaguar Properties builds premium residential communities and investment-led developments across Bengaluru, Qatar, Calicut and Dubai.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  icons: {
    icon: siteMedia.jaguarPropertiesLogo,
    apple: siteMedia.jaguarPropertiesLogo
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          {children}
          <Toaster richColors position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
