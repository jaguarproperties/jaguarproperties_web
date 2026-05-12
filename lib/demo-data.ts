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
      "Premium plotted development divided into multiple blocks on NH-648, Doddaballapura Town, Bangalore North.",
    description:
      "Jaguar City is a large-scale plotted development strategically located along NH-648 in the fast-growing corridor of Doddaballapura, Bangalore North. Designed for both investors and future homeowners, the project offers well-planned residential plots with strong appreciation potential. Key features include a master-planned layout, well-structured residential blocks, wide internal roads, gated community planning, drainage and underground infrastructure planning, and excellent highway connectivity. Located in one of North Bangalore's emerging growth zones, Jaguar City offers strong ROI potential due to expanding infrastructure and proximity to industrial and residential hubs.",
    city: "Bangalore North",
    location: "NH-648, Doddaballapura Town",
    country: "India",
    priceRange: "Premium Plotted Development",
    areaSqFt: 2400,
    areaLabel: "Multiple Blocks",
    tags: ["Under Process", "Premium Plots", "Master-Planned Layout", "High ROI Potential"],
    status: ProjectStatus.LAUNCHING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 1,
    coverImage: siteMedia.jaguarCityProject,
    gallery: [
      siteMedia.jaguarCityProject,
      siteMedia.jaguarCityCommunity,
      siteMedia.jaguarCityGrowth
    ],
    seoTitle: "Jaguar City | Premium Plotted Development",
    seoDescription:
      "Explore Jaguar City, a premium plotted development on NH-648 in Doddaballapura Town with strong connectivity and appreciation potential.",
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
      "Premium villa plots for a better tomorrow at Gauribidanur, near Bengaluru.",
    description:
      "Green Hills is a premium villa plot development designed for peaceful living and long-term investment. Surrounded by natural greenery, the project offers a serene environment away from city congestion while maintaining accessibility. Project highlights include a DTCP approved layout, E-Khata availability, DC conversion completed, readiness for registration, clear legal documentation, and spacious villa plots. Ideal for those seeking a calm environment, Green Hills combines legal clarity, open spaces, and future development potential in a fast-developing location.",
    city: "Near Bengaluru",
    location: "Gauribidanur",
    country: "India",
    priceRange: "Premium Villa Plots",
    areaSqFt: 1200,
    areaLabel: "DTCP Approved Layout",
    tags: ["Under Process", "Villa Plots", "E-Khata", "Ready for Registration"],
    status: ProjectStatus.LAUNCHING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 3,
    coverImage: siteMedia.greenHillsProject,
    gallery: [
      siteMedia.greenHillsProject,
      siteMedia.greenHills,
      siteMedia.jaguarCityGrowth
    ],
    seoTitle: "Green Hills | Premium Villa Plots Near Bengaluru",
    seoDescription:
      "Explore Green Hills, premium villa plots near Bengaluru with DTCP approval, E-Khata, legal clarity, and registration readiness.",
    createdAt: new Date(),
    updatedAt: new Date(),
    properties: []
  },
  {
    id: "demo-project-4",
    title: "Emirates City",
    slug: "emirates-city",
    summary:
      "Integrated township development divided into multiple blocks adjacent to Jaguar City on NH-648, Doddaballapura.",
    description:
      "Emirates City is a proposed integrated township offering a blend of residential plots and future-ready infrastructure. Positioned adjacent to Jaguar City, this project is planned to create a modern community experience. Key features include township-style development, planned residential blocks, flexible payment plans, strategic highway access, and future community amenities. Its flexible payment structure makes it ideal for investors looking to secure property with manageable installments in a high-growth corridor.",
    city: "Doddaballapura",
    location: "NH-648, Doddaballapura",
    country: "India",
    priceRange: "Flexible Payment Plans Available",
    areaSqFt: 2400,
    areaLabel: "Multiple Blocks",
    tags: ["Upcoming", "Integrated Township", "Flexible Payment Plans", "High-Growth Corridor"],
    status: ProjectStatus.UPCOMING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 4,
    coverImage: siteMedia.emiratesCityProject,
    gallery: [
      siteMedia.emiratesCityProject,
      siteMedia.emiratesCity,
      siteMedia.jaguarCityGrowth
    ],
    seoTitle: "Emirates City | Integrated Township",
    seoDescription:
      "Explore Emirates City, an integrated township in Doddaballapura with flexible payment plans and future-ready community planning.",
    createdAt: new Date(),
    updatedAt: new Date(),
    properties: []
  },
  {
    id: "demo-project-5",
    title: "Jaguar Diamond City",
    slug: "jaguar-diamond-city",
    summary:
      "Premium plotted project on SH-74, Doddaballapura to Nelamangala Highway.",
    description:
      "Jaguar Diamond City is a boutique plotted development strategically positioned along SH-74. Designed for focused residential planning, it offers premium plots with strong connectivity to Nelamangala and surrounding hubs. Key features include a well-planned layout, highway-facing location, planned infrastructure development, and investment-friendly plot options. The project also offers direct access to SH-74, easy reach to Nelamangala Highway, and smooth connectivity to Bangalore North.",
    city: "Doddaballapura",
    location: "SH-74, Doddaballapura – Nelamangala Highway",
    country: "India",
    priceRange: "Premium Plotted Project",
    areaSqFt: 1800,
    areaLabel: "Highway-Facing Location",
    tags: ["Upcoming", "Premium Plots", "Highway Connectivity", "Investment-Friendly"],
    status: ProjectStatus.UPCOMING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 5,
    coverImage: siteMedia.jaguarDiamondCityProject,
    gallery: [
      siteMedia.jaguarDiamondCityProject,
      siteMedia.jaguarDiamondCityMain,
      siteMedia.jaguarCityGrowth
    ],
    seoTitle: "Jaguar Diamond City | Premium Plotted Project",
    seoDescription:
      "Explore Jaguar Diamond City, a premium plotted project on SH-74 with direct highway access and smooth connectivity to Bangalore North.",
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
    title: "Jaguar Properties Strengthens Investment Opportunities in North Bangalore",
    slug: "jaguar-properties-strengthens-investment-opportunities-in-north-bangalore",
    excerpt:
      "Jaguar Properties continues to create attractive investment opportunities through premium plotted developments in the fast-growing North Bangalore region.",
    content:
      "Jaguar Properties is focusing on expanding premium plotted developments in North Bangalore, one of the fastest-growing real estate corridors in the city. With improved connectivity, infrastructure development, and increasing demand for residential plots, the region has become a preferred choice for investors and homebuyers.\n\nThe company’s projects are designed to provide organized layouts, wide roads, and essential infrastructure to ensure long-term value for buyers. By focusing on quality development and strategic locations, Jaguar Properties aims to provide secure and profitable real estate investment options.",
    coverImage: "/uploads/site-media/news-clipping-investment-opportunities.svg",
    seoTitle: "Jaguar Properties North Bangalore Investment Opportunities",
    seoDescription:
      "Jaguar Properties expands premium plotted developments in North Bangalore with a strong focus on long-term investment value.",
    published: true,
    publishedAt: new Date("2026-05-07T09:00:00.000Z"),
    createdAt: new Date("2026-05-07T09:00:00.000Z"),
    updatedAt: new Date("2026-05-07T09:00:00.000Z")
  },
  {
    id: "demo-post-2",
    title: "New Residential Plot Projects by Jaguar Properties Attract Buyers",
    slug: "new-residential-plot-projects-by-jaguar-properties-attract-buyers",
    excerpt:
      "New plotted developments introduced by Jaguar Properties are gaining attention from buyers seeking affordable land investment opportunities.",
    content:
      "Jaguar Properties has introduced new residential plot developments designed to meet the growing demand for land investments in Bangalore. These projects provide well-planned plots with proper road connectivity and essential infrastructure.\n\nMany investors prefer plotted developments because they offer flexibility to build homes according to personal preferences. Jaguar Properties focuses on delivering reliable developments that combine affordability, accessibility, and long-term investment potential.",
    coverImage: "/uploads/site-media/news-clipping-residential-plots.svg",
    seoTitle: "Jaguar Properties Residential Plot Projects",
    seoDescription:
      "New residential plot projects by Jaguar Properties are drawing buyer attention with affordability and long-term investment potential.",
    published: true,
    publishedAt: new Date("2026-05-08T09:00:00.000Z"),
    createdAt: new Date("2026-05-08T09:00:00.000Z"),
    updatedAt: new Date("2026-05-08T09:00:00.000Z")
  },
  {
    id: "demo-post-3",
    title: "Jaguar Properties Plans Modern Infrastructure in Upcoming Projects",
    slug: "jaguar-properties-plans-modern-infrastructure-in-upcoming-projects",
    excerpt:
      "Upcoming projects by Jaguar Properties will feature modern infrastructure, wide internal roads, and essential utilities for a comfortable residential environment.",
    content:
      "Jaguar Properties is planning to introduce advanced infrastructure features in its upcoming plotted developments. These projects will include wide internal roads, electricity connections, water supply facilities, and efficient drainage systems.\n\nThe goal is to create organized communities where residents can enjoy a comfortable lifestyle while benefiting from property value appreciation. With careful planning and strategic location selection, Jaguar Properties aims to deliver projects that meet modern residential standards.",
    coverImage: "/uploads/site-media/news-clipping-modern-infrastructure.svg",
    seoTitle: "Jaguar Properties Modern Infrastructure Plans",
    seoDescription:
      "Upcoming Jaguar Properties projects will feature modern infrastructure and utilities designed for comfortable residential living.",
    published: true,
    publishedAt: new Date("2026-05-09T09:00:00.000Z"),
    createdAt: new Date("2026-05-09T09:00:00.000Z"),
    updatedAt: new Date("2026-05-09T09:00:00.000Z")
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
