import type { Metadata } from "next";

import { siteMedia } from "@/lib/site-media";
import { defaultLocale, getLocalizedPath, locales, type Locale } from "@/lib/i18n";

const fallbackSiteUrl = "https://jaguarproperties.in";

export const primarySeoKeywords = [
  "Premium Plots Near Me",
  "Plots for Sale Near Me",
  "Residential Plots Near Me",
  "Buy Plot Near Me",
  "Premium Residential Plots",
  "Investment Plots",
  "Plot Purchase",
  "Land for Sale",
  "Plot for Sale",
  "Villa Plots",
  "Gated Community Plots",
  "Premium Villa Plots",
  "Best Plot Developers",
  "Real Estate Developers",
  "Land Investment",
  "Property Investment",
  "Residential Land for Sale"
] as const;

export const locationSeoKeywords = [
  "Premium Plots in Bangalore",
  "Residential Plots in Bangalore",
  "Investment Plots in Bangalore",
  "Plots for Sale in Bangalore",
  "Buy Plot in Bangalore",
  "Villa Plots in Bangalore",
  "Premium Plots in North Bangalore",
  "Best Plot Developers in Bangalore",
  "BMRDA Approved Plots Bangalore",
  "DTCP Approved Plots Bangalore",
  "Land Investment in Bangalore",
  "Bangalore Property Investment",
  "Real Estate Company Bangalore",
  "Premium Plots in Calicut",
  "Residential Plots in Calicut",
  "Land for Sale in Calicut",
  "Plot Projects in Calicut",
  "Property Investment in Calicut",
  "Villa Plots in Calicut",
  "Real Estate Company in Calicut",
  "Property Investment Qatar",
  "Real Estate Company Qatar",
  "Property Developers Qatar",
  "Investment Property Qatar",
  "Premium Property Qatar",
  "Property Consultant Qatar",
  "Property Investment Dubai",
  "Dubai Real Estate",
  "Luxury Property Dubai",
  "Real Estate Company Dubai",
  "Dubai Investment Properties",
  "Property Consultant Dubai"
] as const;

export const longTailSeoKeywords = [
  "Best Premium Plots Near Me",
  "Premium Plots for Sale in Bangalore",
  "Best Investment Plots in Bangalore",
  "Buy Residential Plot in Bangalore",
  "Premium Plots for Dream Home",
  "High Return Investment Plots",
  "Residential Plots with Clear Title",
  "Safe Real Estate Investment",
  "Premium Gated Community Plots",
  "Future Growth Areas in Bangalore",
  "Premium Land Investment Opportunities"
] as const;

export const siteWideSeoKeywords = [
  "Premium Plots",
  "Residential Plots",
  "Investment Plots",
  "Plot Purchase",
  "Plot for Sale",
  "Land Investment",
  "Villa Plots",
  "Gated Community Plots",
  "Premium Plot Development",
  "Trusted Real Estate Developer",
  "Smart Property Investment",
  "Premium Residential Community",
  "Secure Land Investment",
  "Future Growth Investment",
  "Dream Home Plot"
] as const;

export const highestValueSeoKeywords = [
  "Premium Plots in Bangalore",
  "Residential Plots in Bangalore",
  "Plots for Sale in Bangalore",
  "Investment Plots in Bangalore",
  "Premium Plots Near Me",
  "Buy Plot Near Me",
  "Best Plot Developers in Bangalore",
  "Land Investment in Bangalore",
  "Premium Villa Plots",
  "Gated Community Plots"
] as const;

export const seoFocusKeywords = [
  ...highestValueSeoKeywords,
  ...primarySeoKeywords,
  ...locationSeoKeywords,
  ...longTailSeoKeywords,
  ...siteWideSeoKeywords
] as const;

function dedupeSeoKeywords(keywords: readonly string[]) {
  const seen = new Set<string>();
  return keywords.filter((keyword) => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

export const siteConfig = {
  name: "Jaguar Properties",
  legalName: "Jaguar Properties",
  domain: "jaguarproperties.in",
  baseUrl: (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, ""),
  defaultOgImage: siteMedia.jaguarCityCover,
  companyEmail: "info@jaguarproperties.in",
  companyPhone: "+91 78299 56789",
  address: {
    streetAddress: "5, First Main Road, Second Floor, KHB Layout, Yelahanka New Town",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560064",
    addressCountry: "IN"
  },
  geo: {
    latitude: 13.0984,
    longitude: 77.58476
  },
  socialProfiles: [
    "https://www.instagram.com/jaguarproperties/",
    "https://www.facebook.com/Jaguarproperties2018",
    "https://x.com/JPDevelopers",
    "https://www.youtube.com/@JaguarProperties"
  ],
  defaultKeywords: dedupeSeoKeywords([
    "jaguar properties",
    "jaguarproperties",
    "jaguar",
    ...seoFocusKeywords,
    "premium plots near me",
    "plots near me",
    "buy plot near me",
    "premium residential plots",
    "plots in bangalore",
    "residential plots",
    "residential land for sale",
    "plots for sale",
    "investment plots",
    "plot purchase",
    "real estate bangalore",
    "premium plots",
    "plot investment",
    "land investment",
    "villa plots",
    "gated community plots",
    "plot developers",
    "best plot developers",
    "real estate developers",
    "property investment",
    "plots near north bangalore",
    "dtcp plots bangalore",
    "buy plots in bangalore",
    "land investment bangalore",
    "north bangalore real estate",
    "doddaballapura plots",
    "real estate developer bangalore"
  ])
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.baseUrl}/`).toString();
}

type SeoPageInput = {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  locale = defaultLocale,
  keywords = [],
  image,
  type = "website",
  noIndex = false
}: SeoPageInput): Metadata {
  const url = absoluteUrl(getLocalizedPath(path, locale));
  const ogImage = absoluteUrl(image ?? siteConfig.defaultOgImage);
  const alternateLanguages = Object.fromEntries(
    locales.map((nextLocale) => [nextLocale, absoluteUrl(getLocalizedPath(path, nextLocale))])
  );

  return {
    title,
    description,
    keywords: dedupeSeoKeywords([...siteConfig.defaultKeywords, ...keywords]),
    alternates: {
      canonical: url,
      languages: alternateLanguages
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: locale === "ar" ? "ar_AE" : "en_IN",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : {
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
}

export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type Crumb = {
  name: string;
  path: string;
};

export function buildBreadcrumbSchema(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: siteConfig.legalName,
    url: absoluteUrl("/"),
    logo: absoluteUrl(siteMedia.jaguarPropertiesLogo),
    sameAs: siteConfig.socialProfiles,
    keywords: dedupeSeoKeywords(seoFocusKeywords).join(", "),
    knowsAbout: dedupeSeoKeywords(seoFocusKeywords),
    email: siteConfig.companyEmail,
    telephone: siteConfig.companyPhone,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.companyEmail,
      telephone: siteConfig.companyPhone,
      areaServed: ["Bengaluru", "Calicut", "Qatar", "Dubai", "Karnataka", "India", "UAE"],
      availableLanguage: ["English", "Arabic"]
    }
  };
}

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${absoluteUrl("/")}#local-business`,
    name: siteConfig.name,
    image: absoluteUrl(siteConfig.defaultOgImage),
    logo: absoluteUrl(siteMedia.jaguarPropertiesLogo),
    url: absoluteUrl("/"),
    telephone: siteConfig.companyPhone,
    email: siteConfig.companyEmail,
    priceRange: "$$",
    keywords: dedupeSeoKeywords(seoFocusKeywords).join(", "),
    knowsAbout: dedupeSeoKeywords(seoFocusKeywords),
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude
    },
    areaServed: ["Bengaluru", "Calicut", "Qatar", "Dubai", "North Bengaluru"],
    sameAs: siteConfig.socialProfiles
  };
}

export function buildRealEstateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${absoluteUrl("/")}#real-estate-agent`,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    image: absoluteUrl(siteConfig.defaultOgImage),
    logo: absoluteUrl(siteMedia.jaguarPropertiesLogo),
    priceRange: "$$",
    keywords: dedupeSeoKeywords(seoFocusKeywords).join(", "),
    knowsAbout: dedupeSeoKeywords(seoFocusKeywords),
    areaServed: [
      {
        "@type": "City",
        name: "Bengaluru"
      },
      {
        "@type": "City",
        name: "Calicut"
      },
      {
        "@type": "Country",
        name: "Qatar"
      },
      {
        "@type": "City",
        name: "Dubai"
      },
      {
        "@type": "Place",
        name: "North Bengaluru"
      },
      {
        "@type": "State",
        name: "Karnataka"
      },
      {
        "@type": "Country",
        name: "India"
      }
    ],
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude
    },
    telephone: siteConfig.companyPhone,
    email: siteConfig.companyEmail,
    sameAs: siteConfig.socialProfiles
  };
}

type FaqItem = {
  question: string;
  answer: string;
};

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function buildWebSiteSchema(locale: Locale = defaultLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    url: absoluteUrl(getLocalizedPath("/", locale)),
    name: siteConfig.name,
    publisher: {
      "@id": `${absoluteUrl(getLocalizedPath("/", locale))}#organization`
    },
    keywords: dedupeSeoKeywords(seoFocusKeywords).join(", "),
    inLanguage: locale === "ar" ? "ar-AE" : "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl(getLocalizedPath("/properties", locale))}?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

type ProjectSchemaInput = {
  title: string;
  summary: string;
  description: string;
  slug: string;
  image?: string;
  location: string;
  city: string;
  country: string;
  priceRange: string;
  tags?: string[];
};

export function buildProjectSchema(project: ProjectSchemaInput, locale: Locale = defaultLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: project.title,
    description: project.description || project.summary,
    category: "Residential plots",
    keywords: dedupeSeoKeywords([
      project.title,
      `${project.location} plots`,
      `${project.city} real estate`,
      ...(project.tags ?? []),
      ...seoFocusKeywords
    ]).join(", "),
    brand: {
      "@type": "Brand",
      name: siteConfig.name
    },
    image: project.image ? [absoluteUrl(project.image)] : [absoluteUrl(siteConfig.defaultOgImage)],
    url: absoluteUrl(getLocalizedPath(`/properties/${project.slug}`, locale)),
    additionalProperty: (project.tags ?? []).map((tag) => ({
      "@type": "PropertyValue",
      name: "Project highlight",
      value: tag
    })),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "INR",
        value: project.priceRange
      },
      areaServed: {
        "@type": "Place",
        name: `${project.location}, ${project.city}, ${project.country}`
      },
      seller: {
        "@id": `${absoluteUrl(getLocalizedPath("/", locale))}#organization`
      },
      url: absoluteUrl(getLocalizedPath(`/properties/${project.slug}`, locale))
    }
  };
}

type ArticleSchemaInput = {
  title: string;
  description: string;
  slug: string;
  publishedAt: Date | string;
  image?: string;
};

export function buildArticleSchema(article: ArticleSchemaInput, locale: Locale = defaultLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    keywords: dedupeSeoKeywords([article.title, ...seoFocusKeywords]).join(", "),
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.publishedAt).toISOString(),
    mainEntityOfPage: absoluteUrl(getLocalizedPath(`/news/${article.slug}`, locale)),
    image: [absoluteUrl(article.image ?? siteConfig.defaultOgImage)],
    author: {
      "@type": "Organization",
      name: siteConfig.name
    },
    publisher: {
      "@id": `${absoluteUrl(getLocalizedPath("/", locale))}#organization`
    }
  };
}
