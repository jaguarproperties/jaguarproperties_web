import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/layout/language-provider";

export const metadata: Metadata = {
  title: {
    default: "Jaguar Properties | Luxury Real Estate in Bengaluru, Doha & Dubai",
    template: "%s | Jaguar Properties"
  },
  description:
    "Jaguar Properties builds premium residential communities and investment-led developments across Bengaluru, Doha, and Dubai.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  icons: {
    icon: "/images/jaguar-properties-logo.svg",
    apple: "/images/jaguar-properties-logo.svg"
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
