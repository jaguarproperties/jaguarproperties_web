export type PropertyShowcaseEntry = {
  slug: string;
  title: string;
  location: string;
  city: string;
  address: string;
  price: string;
  areaSqFt: number;
  areaLabel: string;
  categoryLabel: string;
  locationLabel: string;
  badge: string;
  summary: string;
  description: string;
  detailTitle: string;
  detailBody: string;
  highlights: string[];
  image: string;
  gallery: string[];
};

export const allowedPropertyTitles = [
  "Jaguar Diamond City",
  "Jaguar Platinum City",
  "Jaguar Highway Residency",
  "Commercial Converted Plots",
  "Emirates City",
  "Jaguar Farm Lands",
  "Jaguar City Towers",
  "Jaguar Urban Reserve",
  "Jaguar Horizon",
  "Jaguar Greens"
] as const;

export const propertyShowcase: PropertyShowcaseEntry[] = [
  {
    slug: "jaguar-diamond-city-doddaballapura",
    title: "Jaguar Diamond City",
    location: "Doddaballapur",
    city: "Bengaluru",
    address: "Attached to SH-74, Doddaballapura towards Nelamangala, Bangalore North",
    price: "Price on request",
    areaSqFt: 1800,
    areaLabel: "10-acre plotted project",
    categoryLabel: "Ready For Registration",
    locationLabel: "SH-74, Doddaballapura",
    badge: "Plots",
    summary:
      "A 10-acre registration-ready plotted project placed on the Doddaballapura to Nelamangala stretch.",
    description:
      "Jaguar Diamond City is designed for buyers seeking plotted land in a smaller-format project with direct State Highway access and Bangalore North connectivity.",
    detailTitle: "Jaguar Diamond City, Doddaballapura",
    detailBody:
      "Jaguar Diamond City is a 10-acre project located on SH-74, along the Doddaballapura towards Nelamangala route in Bangalore North. The project is positioned for buyers who want ready-for-registration plots in a highway-linked micro-market.",
    highlights: [
      "10-acre project",
      "Ready for registration plots",
      "Attached to SH-74",
      "Doddaballapura towards Nelamangala connectivity"
    ],
    image: "/images/projects/jaguar-city-growth.jpeg",
    gallery: [
      "/images/projects/jaguar-city-growth.jpeg",
      "/images/projects/jaguar-city-cover.png"
    ]
  },
  {
    slug: "emirates-city-doddaballapura",
    title: "Emirates City",
    location: "Doddaballapur",
    city: "Bengaluru",
    address: "Attached to Jaguar City NH-648 at Doddaballapura Town, Bangalore North",
    price: "Flexible payment plans",
    areaSqFt: 2400,
    areaLabel: "100-acre township · 4 blocks",
    categoryLabel: "18-36 Months Payment Plan",
    locationLabel: "NH-648, Doddaballapura",
    badge: "Township",
    summary:
      "A 100-acre township project divided into four blocks with flexible payment plans beside Jaguar City.",
    description:
      "Emirates City expands the Doddaballapura township story with large-format plotted land supported by longer payment-tenure flexibility for buyers and investors.",
    detailTitle: "Emirates City, Doddaballapura",
    detailBody:
      "Emirates City is introduced as a 100-acre project divided into four blocks, attached to the Jaguar City NH-648 corridor at Doddaballapura Town. It is presented as a plotted township opportunity with flexible payment plans ranging from 18 to 36 months.",
    highlights: [
      "100-acre project divided into 4 blocks",
      "Flexible payment plans between 18 and 36 months",
      "Attached to Jaguar City on NH-648",
      "Located at Doddaballapura Town, Bangalore North"
    ],
    image: "/images/projects/jaguar-city-community.jpeg",
    gallery: [
      "/images/projects/jaguar-city-community.jpeg",
      "/images/projects/jaguar-city-cover.png"
    ]
  },
  {
    slug: "jaguar-highway-residency-doddaballapura",
    title: "Jaguar Highway Residency",
    location: "Doddaballapur",
    city: "Bengaluru",
    address: "Attached to SH-09 at Doddaballapura Town, Bangalore North",
    price: "Price on request",
    areaSqFt: 1500,
    areaLabel: "10-acre plotted project",
    categoryLabel: "Ready For Registration",
    locationLabel: "SH-09, Doddaballapura",
    badge: "Highway Access",
    summary:
      "A 10-acre project with registration-ready plots placed directly on the SH-09 corridor.",
    description:
      "Jaguar Highway Residency is designed for buyers looking for a plotted site with immediate registration readiness and practical highway-led access in Doddaballapura.",
    detailTitle: "Jaguar Highway Residency, Doddaballapura",
    detailBody:
      "Jaguar Highway Residency is a 10-acre project attached to SH-09 at Doddaballapura Town in Bangalore North. The positioning makes it suitable for buyers who prioritize easy road access and ready-for-registration plot inventory.",
    highlights: [
      "10-acre project",
      "Ready for registration plots",
      "Attached to SH-09",
      "Located at Doddaballapura Town, Bangalore North"
    ],
    image: "/images/projects/jaguar-city-growth.jpeg",
    gallery: [
      "/images/projects/jaguar-city-growth.jpeg",
      "/images/projects/jaguar-city-community.jpeg"
    ]
  },
  {
    slug: "jaguar-platinum-city-davanagere",
    title: "Jaguar Platinum City",
    location: "Davanagere",
    city: "Davanagere",
    address: "Attached to Davanagere City, Karnataka",
    price: "Flexible payment plans",
    areaSqFt: 2400,
    areaLabel: "52-acre township project",
    categoryLabel: "Flexible Payment Plan",
    locationLabel: "Davanagere, Karnataka",
    badge: "Township",
    summary:
      "A 52-acre township opportunity in Davanagere with flexible payment-plan support.",
    description:
      "Jaguar Platinum City is positioned as a larger-format township project for buyers exploring plotted real estate opportunities beyond Bengaluru in an emerging Karnataka location.",
    detailTitle: "Jaguar Platinum City, Davanagere",
    detailBody:
      "Jaguar Platinum City is described as a 52-acre township project attached to Davanagere City in Karnataka. It is intended for buyers who want a sizable land-led development with flexible payment support in a growing regional market.",
    highlights: [
      "52-acre township project",
      "Flexible payment plans",
      "Attached to Davanagere City",
      "Regional Karnataka growth opportunity"
    ],
    image: "/images/brand/jaguar-brochure-cover.png",
    gallery: [
      "/images/brand/jaguar-brochure-cover.png",
      "/images/projects/jaguar-city-cover.png"
    ]
  },
  {
    slug: "jaguar-farm-lands-doddaballapura",
    title: "Jaguar Farm Lands",
    location: "Doddaballapur",
    city: "Bengaluru",
    address: "20 minutes from Doddaballapura, connecting to Dabaspet via National Highway-648",
    price: "Price on request",
    areaSqFt: 12000,
    areaLabel: "Farm house villa plots · 6000-12000 sq.ft.",
    categoryLabel: "Farm Lands",
    locationLabel: "Doddaballapura - Dabaspet corridor",
    badge: "Farm House Villa Plots",
    summary:
      "A 160-acre farm lands project offering larger-format villa plots for lifestyle and long-hold buyers.",
    description:
      "Jaguar Farm Lands is tailored for buyers who want open-format land with farmhouse villa potential, larger plot sizes, and access to the Doddaballapura-Dabaspet growth belt.",
    detailTitle: "Jaguar Farm Lands, Doddaballapura Corridor",
    detailBody:
      "Jaguar Farm Lands is introduced as a 160-acre project with farm house villa plots of approximately 6000 to 12000 sq.ft. Located around 20 minutes from Doddaballapura and connected toward Dabaspet via NH-648, it is suited to buyers seeking larger land parcels with lifestyle potential.",
    highlights: [
      "160-acre project",
      "Farm house villa plots",
      "Approx. 6000 to 12000 sq.ft. sizes",
      "Connects to Dabaspet via National Highway-648"
    ],
    image: "/images/projects/jaguar-city-community.jpeg",
    gallery: [
      "/images/projects/jaguar-city-community.jpeg",
      "/images/projects/jaguar-city-growth.jpeg"
    ]
  },
  {
    slug: "jaguar-city-towers-apartments",
    title: "Jaguar City Towers",
    location: "Doddaballapur",
    city: "Bengaluru",
    address: "At Jaguar City Township Project, attached to NH-648, Doddaballapura, Bangalore North",
    price: "Price on request",
    areaSqFt: 1200,
    areaLabel: "17-acre apartment project · 500-1000 units",
    categoryLabel: "Apartments",
    locationLabel: "Jaguar City Township, Doddaballapura",
    badge: "Apartment Community",
    summary:
      "A 17-acre apartment project within Jaguar City planned for approximately 500 to 1000 units.",
    description:
      "Jaguar City Towers adds an apartment-led option within the Jaguar City township for buyers who want community living inside the larger Doddaballapura development corridor.",
    detailTitle: "Jaguar City Towers (Apartments)",
    detailBody:
      "Jaguar City Towers is described as a 17-acre apartment project inside the Jaguar City township at Doddaballapura, attached to NH-648. With approximately 500 to 1000 units planned, it offers a residential option for buyers who prefer apartments within a township environment.",
    highlights: [
      "17-acre apartment project",
      "Approx. 500 to 1000 units",
      "Located inside Jaguar City Township",
      "Attached to NH-648, Doddaballapura"
    ],
    image: "/images/projects/jaguar-city-cover.png",
    gallery: [
      "/images/projects/jaguar-city-cover.png",
      "/images/brand/jaguar-brochure-cover.png"
    ]
  },
  {
    slug: "commercial-converted-plots-doddaballapura",
    title: "Commercial Converted Plots",
    location: "Doddaballapur",
    city: "Bengaluru",
    address: "Attached to State Highway-09 at Doddaballapura, Bangalore North",
    price: "Price on request",
    areaSqFt: 2400,
    areaLabel: "Commercial plots · ready for registration",
    categoryLabel: "Commercial Land",
    locationLabel: "State Highway-09, Doddaballapura",
    badge: "Commercial",
    summary:
      "Registration-ready commercial converted plots positioned on the SH-09 corridor in Doddaballapura.",
    description:
      "These commercial converted plots are intended for buyers and investors seeking highway-linked land suited to business-facing or mixed commercial use.",
    detailTitle: "Commercial Converted Plots, Doddaballapura",
    detailBody:
      "The brochure presents these as ready-for-registration commercial converted plots attached to State Highway-09 at Doddaballapura, Bangalore North. They are suitable for buyers looking for commercial land in an access-driven corridor.",
    highlights: [
      "Commercial converted plots",
      "Ready for registration",
      "Attached to State Highway-09",
      "Located at Doddaballapura, Bangalore North"
    ],
    image: "/images/projects/jaguar-city-growth.jpeg",
    gallery: [
      "/images/projects/jaguar-city-growth.jpeg",
      "/images/brand/jaguar-brochure-cover.png"
    ]
  },
  {
    slug: "jaguar-urban-reserve-doddaballapura",
    title: "Jaguar Urban Reserve",
    location: "Doddaballapur",
    city: "Bengaluru",
    address: "Near the Doddaballapura growth corridor, Bangalore North",
    price: "Price on request",
    areaSqFt: 1500,
    areaLabel: "Urban plotted community",
    categoryLabel: "Residential Plots",
    locationLabel: "Doddaballapura, Bangalore North",
    badge: "Urban Plots",
    summary:
      "A residential plotted layout positioned for buyers seeking a compact urban land option in North Bengaluru.",
    description:
      "Jaguar Urban Reserve is positioned for buyers who want plotted inventory in a developing North Bengaluru corridor with practical road access and a residential community setting.",
    detailTitle: "Jaguar Urban Reserve, Doddaballapura",
    detailBody:
      "Jaguar Urban Reserve is presented as a residential plotted development in the Doddaballapura corridor, suited to buyers who want a city-connected land opportunity with room for long-term appreciation.",
    highlights: [
      "Residential plotted development",
      "North Bengaluru growth corridor positioning",
      "Designed for end-users and investors",
      "City-connected road access"
    ],
    image: "/images/projects/jaguar-city-community.jpeg",
    gallery: [
      "/images/projects/jaguar-city-community.jpeg",
      "/images/projects/jaguar-city-cover.png"
    ]
  },
  {
    slug: "jaguar-horizon-doddaballapura",
    title: "Jaguar Horizon",
    location: "Doddaballapur",
    city: "Bengaluru",
    address: "Doddaballapura growth belt, Bangalore North",
    price: "Price on request",
    areaSqFt: 1800,
    areaLabel: "Premium plotted layout",
    categoryLabel: "Residential Plots",
    locationLabel: "Bangalore North corridor",
    badge: "Premium Plots",
    summary:
      "A premium plotted layout aimed at buyers looking for a land-led opportunity in a growing northern corridor.",
    description:
      "Jaguar Horizon is planned for buyers who want premium residential plots backed by access-led growth, location clarity, and long-term development potential.",
    detailTitle: "Jaguar Horizon, Doddaballapura",
    detailBody:
      "Jaguar Horizon is introduced as a premium plotted project within the Doddaballapura belt, positioned for buyers seeking a future-focused land investment with North Bengaluru connectivity.",
    highlights: [
      "Premium residential plots",
      "Positioned in an access-led corridor",
      "Suitable for long-term land buyers",
      "North Bengaluru growth exposure"
    ],
    image: "/images/projects/jaguar-city-growth.jpeg",
    gallery: [
      "/images/projects/jaguar-city-growth.jpeg",
      "/images/projects/jaguar-city-community.jpeg"
    ]
  },
  {
    slug: "jaguar-greens-doddaballapura",
    title: "Jaguar Greens",
    location: "Doddaballapur",
    city: "Bengaluru",
    address: "Greenfield layout zone near Doddaballapura, Bangalore North",
    price: "Price on request",
    areaSqFt: 1500,
    areaLabel: "Residential plotted project",
    categoryLabel: "Green Community Plots",
    locationLabel: "Doddaballapura green belt",
    badge: "Green Living",
    summary:
      "A plotted community designed around open surroundings for buyers prioritizing a greener residential setting.",
    description:
      "Jaguar Greens is shaped for buyers who want residential plots in a quieter, green-led setting while remaining connected to the wider Doddaballapura growth corridor.",
    detailTitle: "Jaguar Greens, Doddaballapura",
    detailBody:
      "Jaguar Greens is presented as a residential plotted development with a greener project character, intended for families and investors looking for balanced lifestyle and land value potential.",
    highlights: [
      "Residential plots in a green-led setting",
      "Designed for families and long-hold buyers",
      "Access to the Doddaballapura corridor",
      "Lifestyle and investment potential"
    ],
    image: "/images/brand/jaguar-brochure-cover.png",
    gallery: [
      "/images/brand/jaguar-brochure-cover.png",
      "/images/projects/jaguar-city-cover.png"
    ]
  }
];

export const propertyShowcaseBySlug = Object.fromEntries(
  propertyShowcase.map((entry) => [entry.slug, entry])
);
