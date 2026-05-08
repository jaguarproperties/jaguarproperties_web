import { LeadStatus, ProjectStatus, PropertyStatus } from "@prisma/client";
import { propertyShowcase } from "@/lib/property-showcase";
import { siteMedia } from "@/lib/site-media";

export const demoSiteContent = {
  id: "demo-site-content",
  heroTitle: "Jaguar City opens a new chapter of plotted living in North Bengaluru.",
  heroSubtitle:
    "A 190-hectare integrated township in Doddaballapura with premium plots, modern infrastructure, community amenities, and strong long-term investment potential near Bengaluru's airport growth corridor.",
  heroImage: siteMedia.jaguarCityCover,
  homePrimaryCtaLabel: "View Projects",
  homePrimaryCtaHref: "/properties",
  homeSecondaryCtaLabel: "Contact Us",
  homeSecondaryCtaHref: "/contact",
  homePresenceLocations: "Bengaluru\nDoha\nDubai",
  homeSignatureText:
    "Crafted for investors and homeowners who value clarity, location, and design-led development.",
  homeSpotlightLabel: "Property Spotlight",
  homeSpotlightTitle: "Premium villa\n4 BHK · 3,200 sqft",
  homeSpotlightText: "Near Yelahanka Lake with concierge-ready amenities.",
  homeSpotlightPrice: "₹ 2.8 Cr",
  homeStats:
    "15+|Years of combined leadership across residential planning, sales, and delivery.\n03|Core markets anchored by Bengaluru demand and Gulf-facing investor interest.\nEnd-to-end|Support from discovery and site visits to documentation, handover, and after-sales care.",
  aboutTitle: "Trusted plotted development for families and future-focused buyers.",
  aboutBody:
    "Jaguar Properties presents carefully selected plotted communities designed to help families build dream homes with greater confidence, transparent support, and long-term growth potential.",
  mission:
    "To provide premium and affordable plots with transparent processes, quality infrastructure, and a secure path to land ownership for every family.",
  vision:
    "To develop world-class townships and become a benchmark in real estate through trust, quality, and innovation.",
  presenceText: "Bengaluru, Doha, and Dubai with market-specific luxury developments.",
  homeFeaturedProjectsTitle: "",
  homeFeaturedProjectsDescription: "",
  homeFeaturedPropertiesTitle: "Featured projects and investment-led opportunities.",
  homeFeaturedPropertiesDescription: "Premium listings across Doddaballapur, Devanahalli, and Yelahanka.",
  homePropertyShowcaseSlugs: propertyShowcase.slice(0, 3).map((property) => property.slug),
  homePortfolioTitle: "Delivered with discipline, curated with care.",
  homePortfolioDescription:
    "Jaguar Properties brings hospitality thinking into every phase of development, from land planning to final handover.",
  homePortfolioItems:
    "Bengaluru|Residential growth|Design-led plotted developments, villas, and apartments placed in high-conviction North Bengaluru corridors.\nDoha|Executive living|Premium residences shaped for professionals, families, and investors seeking quality rental-led markets.\nDubai|Global luxury|High-visibility branded living concepts with strong lifestyle positioning and international buyer appeal.\nClient care|Concierge support|A guided ownership journey built around trust, transparent communication, and long-term relationship value.",
  homeNewsTitle: "Market insight and development updates.",
  homeNewsDescription: "Editorial coverage, investor notes, and Jaguar announcements.",
  homeConciergeTitle: "Plan your next acquisition with Jaguar.",
  homeConciergeButtonLabel: "Talk to our team",
  homeConciergeButtonHref: "/contact",
  projectsTitle: "",
  projectsDescription: "",
  projectsHighlights: "",
  propertiesTitle: "Signature projects and plotted opportunities.",
  propertiesDescription:
    "Search by project or area, then refine by location, budget, plot size, status, and investment category to find the right Jaguar fit for your lifestyle or investment goals.",
  propertiesHighlights:
    "Growth corridors|Listings are concentrated in locations with improving connectivity, planned infrastructure, and strong buyer interest.\nValue clarity|Whether you are an end-user or investor, Jaguar Properties focuses on properties that communicate a clear lifestyle and pricing story.\nPremium standards|Thoughtful master planning, reliable specifications, and future-ready amenities shape each shortlisted opportunity.",
  newsTitle: "News, updates, and real estate perspectives.",
  newsDescription:
    "Read Jaguar Properties updates, market observations, and practical real estate insights curated for serious buyers and investors.",
  newsHighlights:
    "Project updates|Launch news, construction progress, handover milestones, and brand announcements.\nMarket intelligence|Location trends, buyer signals, and investment themes shaping Jaguar Properties decisions.\nBuyer guidance|Helpful content around ownership planning, residential selection, and premium housing preferences.",
  portfolioTitle: "Completed spaces with a refined point of view.",
  portfolioDescription:
    "A visual archive of Jaguar Properties developments, lifestyle moments, and design details that define the brand's premium real estate language.",
  portfolioGallery:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80|Signature facades|Contemporary architecture framed around proportion, natural light, and elevated first impressions.\nhttps://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80|Community-led planning|Master plans designed to balance open space, circulation, amenities, and long-term neighborhood quality.\nhttps://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80|Luxury interiors|Living spaces curated for comfort, functionality, and a polished residential experience.\nhttps://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80|Lifestyle amenities|Clubhouses, landscaped zones, and wellness areas that extend value beyond the front door.",
  contactTitle: "Discuss a residence, an investment, or a collaboration.",
  contactDescription:
    "Share your requirements and our advisory team will guide you to the right Jaguar Properties opportunity with clarity, speed, and market-specific insight.",
  contactSupportPoints:
    "Advisory support|Speak with our team about residences, plots, investor inventory, site visits, and partnership opportunities.\nResponsive follow-up|We aim to respond quickly with the right project details, pricing guidance, and next-step support.\nMulti-market presence|Jaguar Properties serves clients across Bengaluru with a brand outlook shaped by Gulf market expectations.",
  careersTitle: "Build your career with JAGUAR PROPERTIES.",
  careersDescription:
    "Jaguar Properties is growing across sales, customer engagement, human resources, and marketing. We welcome people who bring professionalism, urgency, and a strong commitment to client trust.",
  careersCulturePoints:
    "A fast-moving real estate environment with exposure to sales, customer advisory, and project operations.\nOpportunities to grow with a brand focused on premium housing, plotted developments, and market expansion.\nA team culture built around ownership, relationship-building, and consistent client experience.",
  contactEmail: "info@jaguarproperties.in",
  contactPhone: "+91 78299 56789",
  officeAddress:
    "Bangalore – Head Office\n5, First Main Road, Second Floor\nKHB Layout, Yelahanka New Town\nBangalore – 560064, India\n\nDubai – UAE – Branch Office\n\nCalicut – India – Branch Office",
  mapEmbedUrl: "https://www.google.com/maps?q=13.09840,77.58476&z=17&output=embed",
  footerBlurb: "Premium real estate experiences across Bengaluru, Doha, and Dubai.",
  footerCopyright:
    "© 2026 JAGUAR PROPERTIES. Premium real estate developer for Bengaluru, Qatar, and Dubai.",
  footerNote: "Designed for modern buyers, fast performance, and mobile responsiveness.",
  instagramUrl: "https://www.instagram.com/jaguarproperties/",
  linkedinUrl: "https://linkedin.com",
  facebookUrl: "https://www.facebook.com/Jaguarproperties2018",
  twitterUrl: "https://x.com/JPDevelopers",
  youtubeUrl: "https://www.youtube.com/@JaguarProperties",
  createdAt: new Date(),
  updatedAt: new Date()
};

export const demoProjects = [
  {
    id: "demo-project-1",
    title: "JAGUAR CITY",
    slug: "jaguar-city",
    summary:
      "100 acres divided into 4 blocks, ready for registration, attached to NH-648 at Doddaballapura Town in Bangalore North.",
    description:
      "JAGUAR CITY is a 100-acre project divided into four blocks and positioned as a ready-for-registration plotted development attached to NH-648 at Doddaballapura Town, Bangalore North. It is designed for buyers who want immediate documentation readiness, strong highway visibility, and a large-format township opportunity in the Doddaballapura growth corridor.",
    city: "Bengaluru",
    location: "Doddaballapura",
    country: "India",
    priceRange: "Ready For Registration",
    status: ProjectStatus.LAUNCHING,
    completionDate: null,
    featured: true,
    coverImage: siteMedia.jaguarCityCover,
    gallery: [
      siteMedia.jaguarCity,
      siteMedia.jaguarCityCommunity,
      siteMedia.jaguarCityGrowth
    ],
    seoTitle: "Jaguar City | 100 Acres at NH-648 Doddaballapura",
    seoDescription: "Explore Jaguar City, a 100-acre four-block project ready for registration at NH-648, Doddaballapura Town, Bangalore North.",
    createdAt: new Date(),
    updatedAt: new Date(),
    properties: []
  },
  {
    id: "demo-project-2",
    title: "EMIRATES CITY",
    slug: "emirates-city",
    summary:
      "100 acres divided into 4 blocks with flexible payment plans between 18 and 36 months, attached to Jaguar City on NH-648.",
    description:
      "EMIRATES CITY is a 100-acre project divided into four blocks and attached to the Jaguar City corridor on NH-648 at Doddaballapura Town, Bangalore North. The project is positioned for buyers who want a large plotted development with flexible payment plans structured between 18 and 36 months.",
    city: "Bengaluru",
    location: "Doddaballapura",
    country: "India",
    priceRange: "Flexible Payment Plans (18 - 36 Months)",
    status: ProjectStatus.LAUNCHING,
    completionDate: null,
    featured: true,
    coverImage: siteMedia.emiratesCity,
    gallery: [
      siteMedia.emiratesCity,
      siteMedia.jaguarCityCommunity,
      siteMedia.jaguarCityCover
    ],
    seoTitle: "Emirates City | 100 Acres Beside Jaguar City",
    seoDescription: "Explore Emirates City, a 100-acre four-block project with flexible 18 to 36 month payment plans at Doddaballapura Town, Bangalore North.",
    createdAt: new Date(),
    updatedAt: new Date(),
    properties: []
  },
  {
    id: "demo-project-3",
    title: "JAGUAR FARM LANDS",
    slug: "jaguar-farm-lands",
    summary:
      "160 acres of farm house villa plots, approximately 6000 to 12000 sq.ft., around 20 minutes from Doddaballapura.",
    description:
      "JAGUAR FARM LANDS is a 160-acre project built around larger-format farm house villa plots of approximately 6000 to 12000 sq.ft. The location sits around 20 minutes from Doddaballapura and connects the Dabaspet NH-04 corridor to NH-648, making it suitable for buyers looking for lifestyle-led land holdings with regional connectivity.",
    city: "Bengaluru",
    location: "Doddaballapura Corridor",
    country: "India",
    priceRange: "Approx. 6000 - 12000 sqft",
    status: ProjectStatus.LAUNCHING,
    completionDate: null,
    featured: true,
    coverImage: siteMedia.jaguarFarmLands,
    gallery: [
      siteMedia.jaguarFarmLands,
      siteMedia.jaguarCityCommunity,
      siteMedia.jaguarCityGrowth
    ],
    seoTitle: "Jaguar Farm Lands | 160 Acres Farm House Villa Plots",
    seoDescription: "Explore Jaguar Farm Lands, a 160-acre project with farm house villa plots around 6000 to 12000 sq.ft. near Doddaballapura.",
    createdAt: new Date(),
    updatedAt: new Date(),
    properties: []
  },
  {
    id: "demo-project-4",
    title: "JAGUAR PLATINUM CITY",
    slug: "jaguar-platinum-city",
    summary:
      "A 52-acre township project with flexible payment plans attached to Davanagere High Tech City, Karnataka.",
    description:
      "JAGUAR PLATINUM CITY is a 52-acre township project positioned alongside Davanagere High Tech City in Karnataka. It is presented as a land-led development opportunity for buyers who want a larger township format supported by flexible payment plans in an emerging regional growth market.",
    city: "Davanagere",
    location: "Davanagere High Tech City",
    country: "India",
    priceRange: "Flexible Payment Plans",
    status: ProjectStatus.UPCOMING,
    completionDate: null,
    featured: true,
    coverImage: siteMedia.jaguarBrochureCover,
    gallery: [
      siteMedia.jaguarBrochureCover,
      siteMedia.jaguarCityCover,
      siteMedia.jaguarCityGrowth
    ],
    seoTitle: "Jaguar Platinum City | 52 Acres at Davanagere High Tech City",
    seoDescription: "Explore Jaguar Platinum City, a 52-acre township project with flexible payment plans attached to Davanagere High Tech City, Karnataka.",
    createdAt: new Date(),
    updatedAt: new Date(),
    properties: []
  }
];

const demoProjectByTitle: Record<string, (typeof demoProjects)[number]> = {
  "Emirates City": demoProjects[1],
  "Jaguar Farm Lands": demoProjects[2],
  "Jaguar Platinum City": demoProjects[3]
};

export const demoProperties = propertyShowcase.map((entry, index) => ({
  id: `demo-property-${index + 1}`,
  title: entry.title,
  slug: entry.slug,
  description: entry.description,
  city: entry.city,
  location: entry.location,
  address: entry.address,
  price: entry.price,
  bedrooms: null,
  bathrooms: null,
  areaSqFt: entry.areaSqFt,
  status: PropertyStatus.AVAILABLE,
  featured: index < 3,
  coverImage: entry.image,
  gallery: entry.gallery,
  projectId: demoProjectByTitle[entry.title]?.id ?? demoProjects[0].id,
  createdAt: new Date(),
  updatedAt: new Date(),
  project: demoProjectByTitle[entry.title] ?? demoProjects[0]
}));

export const demoPosts = [
  {
    id: "demo-post-1",
    title: "Why Jaguar City Sits in One of North Bengaluru's Strongest Growth Corridors",
    slug: "jaguar-city-growth-corridor",
    excerpt:
      "From KWIN City to the airport-led industrial belt, Jaguar City is positioned close to major catalysts shaping Doddaballapura's future.",
    content:
      "The Jaguar City brochure highlights several regional growth drivers around Doddaballapura and Devanahalli. These include KWIN City, a planned 5,800-acre knowledge and innovation district; the Information Technology Investment Region spanning 12,000 acres; and the Foxconn manufacturing investment in the wider zone. Together, they strengthen the long-term case for plotted developments positioned near North Bengaluru's evolving infrastructure spine.",
    coverImage: siteMedia.jaguarCityGrowth,
    seoTitle: "Jaguar City Growth Corridor",
    seoDescription:
      "A look at KWIN City, ITIR, Foxconn, and the broader North Bengaluru momentum around Jaguar City.",
    published: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-post-2",
    title: "KIADB and Doddaballapura's Industrial Expansion Add Weight to Jaguar City's Positioning",
    slug: "kiadb-doddaballapura-industrial-expansion",
    excerpt:
      "The brochure points to KIADB's industrial area and Science City pipeline as important context for buyers tracking future demand in the region.",
    content:
      "According to the Jaguar City presentation, the KIADB Doddaballapur Industrial Area extends across more than 900 acres in multiple phases near Kempegowda International Airport. The region already supports industrial activity, textile parks, and the upcoming Science City. For plotted buyers, that broader employment and infrastructure ecosystem can be an important long-term demand signal.",
    coverImage: siteMedia.jaguarCityCommunity,
    seoTitle: "KIADB Doddaballapura and Jaguar City",
    seoDescription:
      "How the KIADB industrial area and surrounding infrastructure strengthen the Doddaballapura case.",
    published: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-post-3",
    title: "Jaguar City Brings Township-Style Amenities Into a Plotted Development Format",
    slug: "jaguar-city-township-amenities",
    excerpt:
      "The brochure highlights amenities such as a clubhouse, tennis court, children's play area, basketball, park and jogging space, and Jaguar International School.",
    content:
      "Jaguar City's presentation positions the township as more than a plotted layout. It calls out lifestyle and family infrastructure including a clubhouse, tennis court, children's play area, basketball court, park and jogging area, and Jaguar International School. That amenity-led positioning supports both everyday livability and long-term value perception.",
    coverImage: siteMedia.jaguarCityCover,
    seoTitle: "Jaguar City Amenities Overview",
    seoDescription:
      "A summary of the township amenities highlighted in the Jaguar City brochure.",
    published: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const demoTestimonials = [
  {
    id: "demo-testimonial-1",
    name: "Raghavendra S",
    message:
      "Jaguar Properties kept the process clear from site visit to documentation. The team was responsive, transparent, and easy to work with throughout.",
    image: siteMedia.jaguarCityCommunity,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-testimonial-2",
    name: "Farah N",
    message:
      "We were looking for a plotted development with long-term value and better road connectivity. Jaguar guided us patiently and answered every question with confidence.",
    image: siteMedia.emiratesCity,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-testimonial-3",
    name: "Vikram Patel",
    message:
      "The overall experience felt professional and well-managed. What stood out most was the speed of follow-up and the clarity around the project details.",
    image: siteMedia.jaguarCityGrowth,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const demoLeads = [] as Array<{
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string | null;
  inquiryType: string | null;
  message: string;
  status: LeadStatus;
  createdAt: Date;
}>;

export const demoApplications = [] as Array<{
  id: string;
  role: string;
  fullName: string;
  email: string;
  location: string;
  phone: string;
  joinDate: Date;
  resumeUrl: string;
  resumeName: string;
  createdAt: Date;
}>;
