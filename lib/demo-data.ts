import { LeadStatus, ProjectStatus, PropertyStatus } from "@prisma/client";
import { propertyShowcase } from "@/lib/property-showcase";
import { siteMedia } from "@/lib/site-media";

export const demoSiteContent = {
  id: "demo-site-content",
  heroTitle: "Jaguar City opens a new chapter of plotted living in North Bengaluru.",
  heroSubtitle:
    "A 100-acer integrated township in Doddaballapura with premium plots, modern infrastructure, community amenities, and strong long-term investment potential near Bengaluru's airport growth corridor.",
  heroImage: siteMedia.jaguarCityCover,
  homePrimaryCtaLabel: "View Projects",
  homePrimaryCtaHref: "/properties",
  homeSecondaryCtaLabel: "Contact Us",
  homeSecondaryCtaHref: "/contact",
  homePresenceLocations: "Bengaluru\nCalicut\nDubai\nQatar",
  homeSignatureText:
    "Crafted for investors and homeowners who value clarity, location, and design-led development.",
  homeSpotlightLabel: "Property Spotlight",
  homeSpotlightTitle: "Premium Villa Plots\n30 X 40 , 30 X 50\n40 X 60 , 50 X 80",
  homeSpotlightText: "In Bengaluru, Calicut, Dubai and Qatar with concierge-ready amenities.",
  homeSpotlightPrice: "Limited Plots Available – Book Now!",
  homeStats:
    "15+|Years of combined leadership across residential planning, sales, and delivery.\n03|Core markets anchored by Bengaluru demand and Gulf-facing investor interest.\nEnd-to-end|Support from discovery and site visits to documentation, handover, and after-sales care.",
  aboutTitle: "Trusted plotted development for families and future-focused buyers.",
  aboutBody:
    "Jaguar Properties presents carefully selected plotted communities designed to help families build dream homes with greater confidence, transparent support, and long-term growth potential.",
  mission:
    "To provide premium and affordable plots with transparent processes, quality infrastructure, and a secure path to land ownership for every family.",
  vision:
    "To develop world-class townships and become a benchmark in real estate through trust, quality, and innovation.",
  presenceText: "Bengaluru, Qatar, Calicut and Dubai with market-specific luxury developments.",
  homeFeaturedProjectsTitle: "",
  homeFeaturedProjectsDescription: "",
  homeFeaturedPropertiesTitle: "Featured projects and investment-led opportunities.",
  homeFeaturedPropertiesDescription: "Premium listings across Doddaballapur, Devanahalli, and Yelahanka.",
  homeFeaturedVideoUrl: "https://www.youtube.com/watch?v=PECY5ZfJp4k",
  homePropertyShowcaseSlugs: propertyShowcase.slice(0, 3).map((property) => property.slug),
  homePortfolioTitle: "Delivered with discipline, curated with care.",
  homePortfolioDescription:
    "Jaguar Properties brings hospitality thinking into every phase of development, from land planning to final handover.",
  homePortfolioItems:
    "Bengaluru|Residential growth|Design-led plotted developments, villas, and apartments placed in high-conviction North Bengaluru corridors.\nQatar|Executive living|Premium residences shaped for professionals, families, and investors seeking quality rental-led markets.\nDubai|Global luxury|High-visibility branded living concepts with strong lifestyle positioning and international buyer appeal.\nClient care|Concierge support|A guided ownership journey built around trust, transparent communication, and long-term relationship value.",
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
    "Bangalore – Head Office\n5, First Main Road, Second Floor\nKHB Layout, Yelahanka New Town\nBangalore – 560064, India\n\nDubai – UAE – Branch Office\n\nCalicut – India – Branch Office\n\nQatar – Branch Office",
  mapEmbedUrl: "https://www.google.com/maps?q=13.09840,77.58476&z=17&output=embed",
  footerBlurb: "Premium real estate experiences across Bengaluru, Qatar, Calicut and Dubai.",
  footerCopyright:
    "© 2026 JAGUAR PROPERTIES. Premium real estate developer for Bengaluru, Qatar, Calicut and Dubai.",
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
    title: "Jaguar City",
    slug: "jaguar-city",
    summary:
      "Premium Plotted Development divided into 4 blocks at NH-648, Doddaballapura Town, Bangalore North.",
    description:
      "JAGUAR CITY is a strategically located large-scale premium plotted development divided into four blocks. Located on NH-648 at Doddaballapura Town in Bangalore North, the project is currently under process and offers excellent connectivity along with strong long-term investment potential.",
    city: "Bangalore North",
    location: "NH-648, Doddaballapura Town",
    country: "India",
    priceRange: "Premium Plotted Development",
    areaSqFt: 2400,
    areaLabel: "4 Blocks",
    tags: ["Under Process", "Premium Plots", "High Investment Potential"],
    status: ProjectStatus.LAUNCHING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 1,
    coverImage: siteMedia.jaguarCityCover,
    gallery: [
      siteMedia.jaguarCity,
      siteMedia.jaguarCityCommunity,
      siteMedia.jaguarCityGrowth
    ],
    seoTitle: "Jaguar City | Premium Plotted Development",
    seoDescription: "Explore Jaguar City, a premium four-block project at NH-648, Doddaballapura Town, Bangalore North.",
    createdAt: new Date(),
    updatedAt: new Date(),
    properties: []
  },
  {
    id: "demo-project-2",
    title: "Jaguar Paradise",
    slug: "jaguar-paradise",
    summary:
      "A plotted community built for buyers who want gated living, registration clarity, and a growth-led North Bengaluru address.",
    description:
      "Jaguar Paradise is positioned as a premium plotted community for families and investors who want a balanced combination of location access, documentation readiness, and a cleaner residential environment in the broader Bengaluru growth corridor.",
    city: "Bengaluru",
    location: "North Bengaluru",
    country: "India",
    priceRange: "Price on request",
    areaSqFt: 1500,
    areaLabel: "Premium plotted community",
    tags: ["Premium", "Listing"],
    status: ProjectStatus.LAUNCHING,
    completionDate: null,
    featured: false,
    visible: false,
    sortOrder: 2,
    coverImage: siteMedia.jaguarCityCommunity,
    gallery: [
      siteMedia.jaguarCityCommunity,
      siteMedia.jaguarCityCover,
      siteMedia.jaguarCityGrowth
    ],
    seoTitle: "Jaguar Paradise | Premium Plotted Community",
    seoDescription: "Discover Jaguar Paradise, a premium plotted community in the North Bengaluru growth corridor.",
    createdAt: new Date(),
    updatedAt: new Date(),
    properties: []
  },
  {
    id: "demo-project-3",
    title: "Green Hills",
    slug: "green-hills",
    summary:
      "Premium Villa Plots for a Better Tomorrow near Bengaluru in a peaceful, growth-focused community.",
    description:
      "GREEN HILLS is a peaceful villa plot community at Gauribidanur near Bengaluru, designed for comfortable living and long-term growth. The project is under process and highlights DTCP approved layout planning with E-Khata and completed DC conversion.",
    city: "Near Bengaluru",
    location: "Gauribidanur",
    country: "India",
    priceRange: "Premium Villa Plots",
    areaSqFt: 1200,
    areaLabel: "DTCP Approved · E-Khata · DC Conversion",
    tags: ["Under Process", "Villa Plots", "Long-Term Growth"],
    status: ProjectStatus.LAUNCHING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 3,
    coverImage: "/uploads/site-media/green-hills.jpeg",
    gallery: [
      siteMedia.jaguarCityGrowth,
      siteMedia.jaguarCityCommunity,
      siteMedia.jaguarCityCover
    ],
    seoTitle: "Green Hills | Premium Villa Plots Near Bengaluru",
    seoDescription: "Explore Green Hills, a peaceful villa plot community with DTCP approved layout planning, E-Khata, and completed DC conversion.",
    createdAt: new Date(),
    updatedAt: new Date(),
    properties: []
  },
  {
    id: "demo-project-4",
    title: "Emirates City",
    slug: "emirates-city",
    summary:
      "Integrated Township divided into 4 blocks adjacent to Jaguar City on NH-648, Doddaballapura.",
    description:
      "EMIRATES CITY is an integrated township divided into four blocks and positioned adjacent to Jaguar City on NH-648, Doddaballapura. The project is upcoming and offers flexible payment plans from 18 to 36 months for buyers seeking a large-scale plotted township opportunity.",
    city: "Adjacent to Jaguar City",
    location: "NH-648, Doddaballapura",
    country: "India",
    priceRange: "Flexible Payment Plans (18 - 36 Months)",
    areaSqFt: 2400,
    areaLabel: "4 Blocks",
    tags: ["Upcoming", "Integrated Township", "Flexible Payment Plan"],
    status: ProjectStatus.UPCOMING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 4,
    coverImage: "/uploads/site-media/emirates-city-main.png",
    gallery: [
      siteMedia.emiratesCity,
      siteMedia.jaguarCityCommunity,
      siteMedia.jaguarCityCover
    ],
    seoTitle: "Emirates City | Integrated Township",
    seoDescription: "Explore Emirates City, an integrated township beside Jaguar City with flexible 18 to 36 month payment plans.",
    createdAt: new Date(),
    updatedAt: new Date(),
    properties: []
  },
  {
    id: "demo-project-5",
    title: "Jaguar Diamond City",
    slug: "jaguar-diamond-city",
    summary:
      "Premium Plotted Project on SH-74 with strong Doddaballapura to Nelamangala highway connectivity.",
    description:
      "JAGUAR DIAMOND CITY is a well-planned premium plotted development located on SH-74, Doddaballapura to Nelamangala Highway. The project is upcoming and is positioned for buyers who value a compact project footprint with excellent highway connectivity.",
    city: "Doddaballapura",
    location: "SH-74, Doddaballapura – Nelamangala Highway",
    country: "India",
    priceRange: "Premium Plotted Project",
    areaSqFt: 1800,
    areaLabel: "Premium Plotted Project",
    tags: ["Upcoming", "Highway Connectivity", "Premium Plots"],
    status: ProjectStatus.UPCOMING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 5,
    coverImage: "/uploads/site-media/jaguar-diamond-city-main.png",
    gallery: [
      siteMedia.jaguarCity,
      siteMedia.jaguarCityGrowth,
      siteMedia.jaguarCityCover
    ],
    seoTitle: "Jaguar Diamond City | Premium Plotted Project",
    seoDescription: "Explore Jaguar Diamond City, a premium plotted project on SH-74 with excellent highway connectivity.",
    createdAt: new Date(),
    updatedAt: new Date(),
    properties: []
  }
];

const demoProjectByTitle: Record<string, (typeof demoProjects)[number]> = {
  "Emirates City": demoProjects[3],
  "Jaguar Diamond City": demoProjects[4]
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
    title: "Jaguar City Opens a New Standard for Premium Plotted Living in Doddaballapura",
    slug: "jaguar-city-premium-plotted-living-doddaballapura",
    excerpt:
      "Jaguar City brings a large-format plotted development vision to NH-648 with long-term growth potential, strong road access, and township-style planning.",
    content:
      "Jaguar City is positioned as one of Jaguar Properties' landmark plotted developments in North Bengaluru. Located on NH-648 at Doddaballapura Town, the project combines premium plot offerings, strong growth visibility, and a master-planned layout that appeals to both end users and long-term investors.\n\nThe location strengthens the project's value story through improving connectivity, airport-region momentum, and access to emerging industrial and knowledge corridors. Jaguar City is being presented as a flagship address for buyers who want clarity, scale, and future-ready plotted development in a fast-rising belt of Bengaluru.",
    coverImage: siteMedia.jaguarCityCover,
    seoTitle: "Jaguar City Premium Plotted Living",
    seoDescription:
      "Explore how Jaguar City is shaping premium plotted living in Doddaballapura with scale, connectivity, and long-term value.",
    published: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-post-2",
    title: "Emirates City Highlights Jaguar Properties' Township Vision Beside Jaguar City",
    slug: "emirates-city-township-vision-jaguar-properties",
    excerpt:
      "Emirates City extends the Jaguar Properties vision with an integrated township format, flexible payment planning, and adjacency to the Jaguar City growth corridor.",
    content:
      "Emirates City represents Jaguar Properties' broader township ambition in Doddaballapura. Positioned adjacent to Jaguar City on NH-648, the project is designed as an integrated plotted community divided into four blocks and supported by flexible payment options that make entry easier for a wider buyer segment.\n\nIts placement beside Jaguar City gives the project a strong narrative around scale, future infrastructure, and community-led development. For buyers comparing long-term plotted opportunities, Emirates City adds another layer to Jaguar Properties' North Bengaluru portfolio with a planning approach that balances accessibility and expansion potential.",
    coverImage: "/uploads/site-media/emirates-city-main.png",
    seoTitle: "Emirates City Township Vision",
    seoDescription:
      "See how Emirates City strengthens Jaguar Properties' township-focused presence in the Doddaballapura corridor.",
    published: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-post-3",
    title: "Green Hills Brings a Peaceful Villa Plot Option to Jaguar Properties' Growth Portfolio",
    slug: "green-hills-villa-plot-growth-portfolio",
    excerpt:
      "Green Hills expands Jaguar Properties' project mix with a quieter villa-plot community focused on long-term value, layout quality, and residential comfort.",
    content:
      "Green Hills adds a different lifestyle proposition to the Jaguar Properties portfolio by focusing on premium villa plots in a calmer, growth-oriented setting near Bengaluru. The project emphasizes layout planning, documentation readiness, and a residential environment that appeals to buyers prioritizing both peace and future appreciation.\n\nWith its positioning around DTCP-approved planning, E-Khata support, and completed DC conversion, Green Hills strengthens Jaguar Properties' ability to serve buyers looking beyond dense urban locations. It offers a more tranquil plotted alternative while still fitting into the company's broader premium land and township strategy.",
    coverImage: "/uploads/site-media/green-hills.jpeg",
    seoTitle: "Green Hills Villa Plot Community",
    seoDescription:
      "Discover how Green Hills adds a peaceful premium villa-plot option to Jaguar Properties' project portfolio.",
    published: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const demoTestimonials = [
  {
    id: "demo-testimonial-1",
    name: "Haritha Reddy",
    message:
      "Very recently we bought a property in Jaguar Properties. It was an excellent journey from the discussion with the seller till the registration. Every interaction was transparent. I sincerely thank the team.",
    image: "/uploads/site-media/testimonial-demo-profile.png",
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-testimonial-2",
    name: "Akash Sharma",
    message:
      "I bought a plot in Jaguar Properties. I received possession with all legal documents and never faced any issues. They provided good service and the plot pricing and location are very good.",
    image: "/uploads/site-media/testimonial-demo-profile.png",
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-testimonial-3",
    name: "Joseph Geethan",
    message:
      "We are happy to deal with a company that understands direct selling. The team is professional and extremely helpful. The location in Bangalore is very good and we truly appreciate the experience.",
    image: "/uploads/site-media/testimonial-demo-profile.png",
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-testimonial-4",
    name: "Manoj Kumar",
    message:
      "We are very happy with the price offered by Jaguar Properties to own a home. We are satisfied with the service they provided. Wishing the team great success in the future.",
    image: "/uploads/site-media/testimonial-demo-profile.png",
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
