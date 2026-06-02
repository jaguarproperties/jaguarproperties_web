import type { Metadata } from "next";

import { siteMedia } from "@/lib/site-media";
import { defaultLocale, getLocalizedPath, locales, type Locale } from "@/lib/i18n";

const fallbackSiteUrl = "https://jaguarproperties.in";

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
  defaultKeywords: [
    "jaguar properties",
    "jaguarproperties",
    "jaguar",
    "plots in bangalore",
    "residential plots",
    "plots for sale",
    "investment plots",
    "real estate bangalore",
    "premium plots",
    "plot investment",
    "plots near north bangalore",
    "dtcp plots bangalore",
    "buy plots in bangalore",
    "land investment bangalore",
    "gated community plots",
    "north bangalore real estate",
    "doddaballapura plots",
    "real estate developer bangalore"
  ]
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
    keywords: [...siteConfig.defaultKeywords, ...keywords],
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
      areaServed: ["Bengaluru", "North Bengaluru", "Karnataka", "India"],
      availableLanguage: ["English", "Arabic"]
    }
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
    areaServed: [
      {
        "@type": "City",
        name: "Bengaluru"
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
