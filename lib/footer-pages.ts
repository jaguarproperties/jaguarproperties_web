export type FooterPage = {
  title: string;
  category: string;
  href: string;
  eyebrow: string;
  description: string;
  intro: string;
  highlights: string[];
  sections: Array<{
    heading: string;
    body: string;
    bullets?: string[];
  }>;
};

export const footerNavigationColumns = [
  {
    title: "Our Journey",
    links: [
      ["Corporate Overview", "/our-journey/corporate-overview"],
      ["The Jaguar Family", "/our-journey/the-jaguar-family"],
      ["Leadership", "/our-journey/leadership"],
      ["MD's Message", "/our-journey/mds-message"],
      ["The Team", "/our-journey/the-team"],
      ["Our Values", "/our-journey/our-values"],
      ["CSR", "/our-journey/csr"],
      ["Awards", "/our-journey/awards"]
    ]
  },
  {
    title: "Buyer's Guide",
    links: [
      ["EMI Calculator", "/buyers-guide/emi-calculator"],
      ["First Steps to Buying Property", "/buyers-guide/first-steps-to-buying-property"],
      ["Property Buying Checklist", "/buyers-guide/property-buying-checklist"],
      ["Current Real Estate Trends", "/buyers-guide/current-real-estate-trends"]
    ]
  },
  {
    title: "Businesses We Serve",
    links: [
      ["Residential", "/businesses-we-serve/residential"],
      ["Office Spaces", "/businesses-we-serve/office-spaces"],
      ["Retail", "/businesses-we-serve/retail"],
      ["Commercial", "/businesses-we-serve/commercial"]
    ]
  },
  {
    title: "Quick Links",
    links: [
      ["Testimonials", "/quick-links/testimonials"],
      ["Events", "/quick-links/events"],
      ["FAQs", "/quick-links/faqs"],
      ["Blogs", "/quick-links/blogs"],
      ["Jaguar Speaks", "/quick-links/jaguar-speaks"],
      ["Our Partners", "/quick-links/our-partners"],
      ["Contact Us", "/quick-links/contact-us"],
      ["Vendor Registration", "/quick-links/vendor-registration"],
      ["Privacy Policy", "/quick-links/privacy-policy"]
    ]
  }
] as const;

export const footerPages: Record<string, FooterPage> = {
  "our-journey/corporate-overview": {
    title: "Corporate Overview",
    category: "Our Journey",
    href: "/our-journey/corporate-overview",
    eyebrow: "Corporate Overview",
    description: "A strategic overview of Jaguar Properties as a premium developer across Bengaluru, Dubai, and Calicut.",
    intro:
      "Jaguar Properties is a design-led real estate developer delivering premium residential and commercial environments with a disciplined focus on planning, execution, and long-term value creation.",
    highlights: ["Premium developer footprint", "Luxury-first planning", "Regional execution strength"],
    sections: [
      {
        heading: "A Focused Growth Platform",
        body:
          "Our operating model is built around high-potential corridors, customer trust, and purposeful design. We pursue opportunities where demand, infrastructure, and brand-led delivery create enduring value."
      },
      {
        heading: "Where We Operate",
        body:
          "From Bengaluru's expanding urban markets to Dubai's global investor ecosystem and Calicut's emerging demand clusters, Jaguar Properties adapts its strategy to each city's buyer profile and growth cycle."
      },
      {
        heading: "What Defines Jaguar",
        body:
          "We combine market intelligence, transparent processes, and premium finish standards to shape projects that remain relevant for homeowners, investors, and business occupiers alike."
      }
    ]
  },
  "our-journey/the-jaguar-family": {
    title: "The Jaguar Family",
    category: "Our Journey",
    href: "/our-journey/the-jaguar-family",
    eyebrow: "The Jaguar Family",
    description: "How Jaguar Properties builds a collaborative culture around clients, partners, and teams.",
    intro:
      "We see Jaguar as more than a company. It is a professional family of advisors, project teams, channel partners, consultants, and customers connected by a common standard of excellence.",
    highlights: ["People-first culture", "Long-term relationships", "Shared accountability"],
    sections: [
      {
        heading: "Built On Partnership",
        body:
          "Every project relies on aligned teams across design, engineering, sales, legal, finance, and customer experience. We invest in collaboration because quality is never created in isolation."
      },
      {
        heading: "A Strong Sense of Belonging",
        body:
          "We create environments where performance and mutual respect go together. That mindset carries into how we engage buyers, vendors, consultants, and landowners."
      }
    ]
  },
  "our-journey/leadership": {
    title: "Leadership",
    category: "Our Journey",
    href: "/our-journey/leadership",
    eyebrow: "Leadership",
    description: "Meet the leadership philosophy guiding Jaguar Properties' premium development strategy.",
    intro:
      "Our leadership team combines market vision with operational discipline, ensuring every Jaguar development is supported by thoughtful planning, governance, and execution control.",
    highlights: ["Vision with discipline", "Execution governance", "Customer-centric decisions"],
    sections: [
      {
        heading: "Strategic Direction",
        body:
          "Leadership at Jaguar focuses on sustainable growth, clear brand positioning, and asset creation that performs for both end-users and investors."
      },
      {
        heading: "Decision-Making With Responsibility",
        body:
          "We prioritize transparency, realistic commitments, and risk-aware development decisions so the business grows with trust rather than short-term noise."
      }
    ]
  },
  "our-journey/mds-message": {
    title: "MD's Message",
    category: "Our Journey",
    href: "/our-journey/mds-message",
    eyebrow: "MD's Message",
    description: "A leadership message from the Founder, Chairman & Managing Director of Jaguar Properties.",
    intro:
      "At Jaguar Properties, our journey began with a simple yet powerful belief: real estate is not just about land and buildings, but about building trust, communities, and futures. We are driven by a commitment to excellence, integrity, and innovation in the real estate sector. As we move forward, we remain committed to building lasting legacies through spaces that inspire, appreciate, and empower. Whether you are a first-time buyer, seasoned investor, or business partner, Jaguar Properties is your reliable gateway to premium real estate opportunities.",
    highlights: ["Trust", "Vision", "Legacy"],
    sections: [
      {
        heading: "Leadership",
        body:
          "He is the driving force behind Jaguar Properties' growth and success, recognized for his entrepreneurial skills and business acumen."
      },
      {
        heading: "Vision",
        body:
          "From day one, my vision was to create a company that places people before profits, values transparency over transactions, and builds with purpose, not just profit. With over 20 years in the industry, I have witnessed how the right property decisions can transform lives, generate wealth, and shape legacies. That belief continues to guide every decision we make."
      },
      {
        heading: "Legacy",
        body:
          "Under Tanveer Khwaja's leadership, Jaguar Properties has completed and developed landmark projects, expanding its presence across multiple developments in Bangalore North. As we continue to grow, I invite you to be a part of our journey, whether as a homeowner, investor, or partner, and experience the difference that integrity, vision, and passion can make."
      }
    ]
  },
  "our-journey/the-team": {
    title: "The Team",
    category: "Our Journey",
    href: "/our-journey/the-team",
    eyebrow: "The Team",
    description: "A look at the multidisciplinary teams behind Jaguar Properties.",
    intro:
      "Jaguar teams span land acquisition, architecture coordination, legal documentation, sales advisory, construction oversight, marketing, and customer service.",
    highlights: ["Multidisciplinary teams", "Execution support", "Buyer experience focus"],
    sections: [
      {
        heading: "Specialists Across The Development Cycle",
        body:
          "Each department is accountable for a specific layer of performance, yet closely integrated so decisions remain coordinated from concept to handover."
      },
      {
        heading: "Client Experience At The Centre",
        body:
          "From discovery to documentation and after-sales support, our team structure is designed to keep the customer journey responsive and professionally managed."
      }
    ]
  },
  "our-journey/our-values": {
    title: "Our Values",
    category: "Our Journey",
    href: "/our-journey/our-values",
    eyebrow: "Our Values",
    description: "The principles that shape how Jaguar Properties builds and serves.",
    intro:
      "Our values guide every project decision, every client conversation, and every partnership we form across the Jaguar ecosystem.",
    highlights: ["Integrity", "Clarity", "Commitment"],
    sections: [
      {
        heading: "How We Work",
        body:
          "We value transparency in communication, precision in execution, and consistency in customer experience. Those standards influence how we plan, sell, and deliver."
      },
      {
        heading: "What Buyers Can Expect",
        body:
          "Clients can expect honest guidance, professional conduct, and a brand that values trust as much as visibility."
      }
    ]
  },
  "our-journey/csr": {
    title: "CSR",
    category: "Our Journey",
    href: "/our-journey/csr",
    eyebrow: "Corporate Social Responsibility",
    description: "Jaguar Properties' approach to responsible growth and community impact.",
    intro:
      "We believe responsible development must go beyond buildings. Jaguar supports initiatives that strengthen communities, improve local environments, and promote inclusive opportunity.",
    highlights: ["Community impact", "Responsible growth", "Long-term stewardship"],
    sections: [
      {
        heading: "Meaningful Contribution",
        body:
          "Our CSR focus includes local engagement, people development, and support initiatives that reflect the needs of the communities around our projects."
      },
      {
        heading: "Building With Responsibility",
        body:
          "We aim to create projects that contribute to healthier urban ecosystems through thoughtful planning, better amenity thinking, and disciplined site execution."
      }
    ]
  },
  "our-journey/awards": {
    title: "Awards",
    category: "Our Journey",
    href: "/our-journey/awards",
    eyebrow: "Awards",
    description: "Recognition earned through quality, delivery, and customer confidence.",
    intro:
      "Industry recognition matters most when it reflects real performance. Jaguar views awards as a by-product of strong design, customer trust, and consistent delivery discipline.",
    highlights: ["Industry recognition", "Design credibility", "Customer confidence"],
    sections: [
      {
        heading: "Recognition Through Delivery",
        body:
          "Awards validate our commitment to quality, project branding, and professional standards across the development lifecycle."
      },
      {
        heading: "A Standard To Uphold",
        body:
          "Every recognition we earn reinforces the need to keep improving design quality, market responsiveness, and client satisfaction."
      }
    ]
  },
  "buyers-guide/emi-calculator": {
    title: "EMI Calculator",
    category: "Buyer's Guide",
    href: "/buyers-guide/emi-calculator",
    eyebrow: "Buyer's Guide",
    description: "Estimate monthly EMI obligations before choosing your Jaguar property.",
    intro:
      "A clear financial view helps buyers move with confidence. Use the EMI estimator on this page to understand your likely monthly commitment before you invest.",
    highlights: ["Monthly planning", "Loan clarity", "Better decision support"],
    sections: [
      {
        heading: "Why EMI Planning Matters",
        body:
          "Before finalizing a home or investment property, buyers should align price, tenure, and down payment expectations with their cash flow and long-term financial goals."
      },
      {
        heading: "Use It As A Planning Tool",
        body:
          "This calculator is designed for early planning. Final loan terms will depend on lender policies, credit profile, and property-specific documentation."
      }
    ]
  },
  "buyers-guide/first-steps-to-buying-property": {
    title: "First Steps to Buying Property",
    category: "Buyer's Guide",
    href: "/buyers-guide/first-steps-to-buying-property",
    eyebrow: "Buyer's Guide",
    description: "A structured introduction to evaluating and buying premium property.",
    intro:
      "The first steps in buying property are often the most important. A disciplined approach helps buyers compare opportunities with greater confidence and fewer surprises.",
    highlights: ["Clarity before commitment", "Market comparison", "Documentation readiness"],
    sections: [
      {
        heading: "Start With Purpose",
        body:
          "Define whether your purchase is for end use, investment, rental income, or portfolio diversification. That one decision should shape your location and budget filters."
      },
      {
        heading: "Evaluate The Fundamentals",
        body:
          "Look at connectivity, builder credibility, legal readiness, amenity relevance, appreciation potential, and total cost of ownership before narrowing your shortlist."
      }
    ]
  },
  "buyers-guide/property-buying-checklist": {
    title: "Property Buying Checklist",
    category: "Buyer's Guide",
    href: "/buyers-guide/property-buying-checklist",
    eyebrow: "Buyer's Guide",
    description: "A practical checklist for buying premium real estate with fewer risks.",
    intro:
      "A professional checklist protects buyers from missed details and avoidable delays. It also creates a cleaner path from discovery to booking and documentation.",
    highlights: ["Due diligence", "Decision support", "Process readiness"],
    sections: [
      {
        heading: "Before You Book",
        body:
          "Confirm project approvals, land title clarity, pricing structure, payment schedule, location context, and builder credibility."
      },
      {
        heading: "Before You Finalize",
        body:
          "Review agreement terms, hidden charges, possession timelines, lender options, and post-sales service expectations before making your final commitment."
      }
    ]
  },
  "buyers-guide/current-real-estate-trends": {
    title: "Current Real Estate Trends",
    category: "Buyer's Guide",
    href: "/buyers-guide/current-real-estate-trends",
    eyebrow: "Buyer's Guide",
    description: "A Jaguar Properties perspective on the trends shaping premium real estate demand.",
    intro:
      "Real estate is being shaped by changing work habits, premium lifestyle expectations, infrastructure-led growth, and a stronger focus on branded trust.",
    highlights: ["Premium demand shifts", "Infrastructure influence", "Investor confidence"],
    sections: [
      {
        heading: "What Buyers Are Prioritizing",
        body:
          "Space efficiency, wellness, gated environments, flexible lifestyle amenities, and developer credibility continue to shape premium residential demand."
      },
      {
        heading: "What Investors Are Watching",
        body:
          "Investors are increasingly focused on regional growth corridors, market depth, branded inventory, and assets linked to future infrastructure upgrades."
      }
    ]
  },
  "businesses-we-serve/residential": {
    title: "Residential",
    category: "Businesses We Serve",
    href: "/businesses-we-serve/residential",
    eyebrow: "Residential",
    description: "Premium residential solutions shaped around modern living expectations.",
    intro:
      "Jaguar creates residential offerings that balance lifestyle, investment confidence, and design-led utility for contemporary buyers.",
    highlights: ["Luxury homes", "Community-led planning", "Long-term value"],
    sections: [
      { heading: "Homes With Relevance", body: "Our residential work focuses on livability, premium detailing, and location strength to support both personal use and capital appreciation." },
      { heading: "Planned For Better Living", body: "We prioritize circulation, amenity experience, privacy, and long-term maintenance thinking so communities age well over time." }
    ]
  },
  "businesses-we-serve/office-spaces": {
    title: "Office Spaces",
    category: "Businesses We Serve",
    href: "/businesses-we-serve/office-spaces",
    eyebrow: "Office Spaces",
    description: "Workplace environments designed for efficiency, brand image, and operational comfort.",
    intro:
      "Jaguar supports businesses seeking premium office environments that strengthen productivity, client perception, and long-term occupancy value.",
    highlights: ["Efficient workspaces", "Brand-ready interiors", "Strategic location planning"],
    sections: [
      { heading: "Business-Ready Planning", body: "We approach office space with attention to access, employee experience, flexibility, and operational flow." },
      { heading: "Designed For Modern Occupiers", body: "Meeting spaces, circulation, natural light, and infrastructure readiness are considered as core business requirements." }
    ]
  },
  "businesses-we-serve/retail": {
    title: "Retail",
    category: "Businesses We Serve",
    href: "/businesses-we-serve/retail",
    eyebrow: "Retail",
    description: "Retail environments planned to support visibility, circulation, and commercial performance.",
    intro:
      "Retail assets require a strong understanding of customer movement, frontage value, tenant mix, and destination appeal. Jaguar brings that perspective into its commercial thinking.",
    highlights: ["Visibility-led planning", "Tenant appeal", "Customer movement"],
    sections: [
      { heading: "Built For Traffic", body: "Retail environments perform best when access, frontage, parking, and wayfinding work together." },
      { heading: "Designed For Tenants And Brands", body: "We support spaces that help retail brands present well, operate efficiently, and remain relevant to changing consumer behavior." }
    ]
  },
  "businesses-we-serve/commercial": {
    title: "Commercial",
    category: "Businesses We Serve",
    href: "/businesses-we-serve/commercial",
    eyebrow: "Commercial",
    description: "Commercial developments designed for tenant relevance, investor confidence, and operational performance.",
    intro:
      "Commercial assets succeed when location, planning, brand appeal, and functionality converge. Jaguar applies this thinking to opportunities across growing business markets.",
    highlights: ["Tenant relevance", "Investment logic", "Commercial efficiency"],
    sections: [
      { heading: "Planned For Performance", body: "Commercial environments require strong frontage, access, tenant flexibility, and a design language that supports business identity." },
      { heading: "Built Around Market Demand", body: "We evaluate commercial opportunities through the lens of occupancy, usability, and long-term asset competitiveness." }
    ]
  },
  "quick-links/testimonials": {
    title: "Testimonials",
    category: "Quick Links",
    href: "/quick-links/testimonials",
    eyebrow: "Testimonials",
    description: "Buyer and investor perspectives on the Jaguar Properties experience.",
    intro:
      "Trust is best expressed by people who have experienced the process firsthand. Jaguar values customer feedback because it reflects both execution quality and service culture.",
    highlights: ["Buyer confidence", "Investor trust", "Service credibility"],
    sections: [
      { heading: "What Clients Appreciate", body: "Clients consistently value clear communication, disciplined support, documentation transparency, and the confidence that comes from dealing with a premium-oriented team." },
      { heading: "Experience Beyond The Sale", body: "A strong real estate brand is built not only by what it sells, but by how it supports customers through every stage of the journey." }
    ]
  },
  "quick-links/events": {
    title: "Events",
    category: "Quick Links",
    href: "/quick-links/events",
    eyebrow: "Events",
    description: "A look at Jaguar Properties events, showcases, launches, and buyer engagement moments.",
    intro:
      "Events are an important part of how Jaguar connects with buyers, partners, and communities. They create opportunities for transparency, discovery, and brand experience.",
    highlights: ["Project showcases", "Investor interactions", "Brand engagement"],
    sections: [
      { heading: "Launches And Engagement", body: "Our event calendar includes project previews, channel partner interactions, customer meets, and market-facing launch experiences." },
      { heading: "Why Events Matter", body: "For premium real estate, in-person engagement helps buyers understand design quality, location logic, and the people behind the brand." }
    ]
  },
  "quick-links/faqs": {
    title: "FAQs",
    category: "Quick Links",
    href: "/quick-links/faqs",
    eyebrow: "FAQs",
    description: "Answers to the most common questions from Jaguar buyers and investors.",
    intro:
      "We believe buyers should have clarity from the beginning. These frequently asked questions reflect the topics most often discussed with our sales and customer advisory teams.",
    highlights: ["Buying clarity", "Process transparency", "Customer guidance"],
    sections: [
      {
        heading: "Common Questions",
        body: "Buyers typically ask about location advantages, legal readiness, payment plans, possession timelines, and investment potential.",
        bullets: [
          "How do I compare different micro-markets?",
          "What documents should I review before booking?",
          "How can I estimate long-term investment value?"
        ]
      },
      {
        heading: "Where To Go Next",
        body: "For more personalized assistance, buyers can connect with Jaguar's advisory team through the contact page or project inquiry forms."
      }
    ]
  },
  "quick-links/blogs": {
    title: "Blogs",
    category: "Quick Links",
    href: "/quick-links/blogs",
    eyebrow: "Blogs",
    description: "Explore Jaguar Properties blog content and market perspectives.",
    intro:
      "The Jaguar editorial section shares real estate perspectives, development updates, market observations, and location-led insights for serious buyers and investors.",
    highlights: ["Market insight", "Project updates", "Location intelligence"],
    sections: [
      { heading: "What You Will Find", body: "Our blog coverage includes buying guidance, premium housing demand trends, project stories, and strategic market commentary." },
      { heading: "Explore The Full Editorial Archive", body: "Visit the Jaguar news and insights section to read the latest published articles.", bullets: ["Go to the News section from the main navigation for the complete archive."] }
    ]
  },
  "quick-links/jaguar-speaks": {
    title: "Jaguar Speaks",
    category: "Quick Links",
    href: "/quick-links/jaguar-speaks",
    eyebrow: "Jaguar Speaks",
    description: "An insight-led section featuring Jaguar Properties perspectives on growth, design, and customer value.",
    intro:
      "Jaguar Speaks is where we share our point of view on the future of premium development, regional growth, buyer expectations, and project thinking.",
    highlights: ["Leadership perspectives", "Strategic insight", "Market intelligence"],
    sections: [
      { heading: "What We Talk About", body: "Topics include infrastructure-led growth, premium living patterns, customer trust, and the changing expectations of real estate buyers." },
      { heading: "Why It Matters", body: "Insight-led communication helps buyers and partners understand not just what we build, but how we think." }
    ]
  },
  "quick-links/our-partners": {
    title: "Our Partners",
    category: "Quick Links",
    href: "/quick-links/our-partners",
    eyebrow: "Our Partners",
    description: "The ecosystem of professionals and partners supporting Jaguar Properties.",
    intro:
      "Every Jaguar development is shaped by a broader network of design partners, consultants, legal teams, contractors, marketing specialists, and channel partners.",
    highlights: ["Trusted ecosystem", "Execution support", "Shared standards"],
    sections: [
      { heading: "Built With Collaboration", body: "Strong partnerships help us maintain quality, clarity, and speed across multiple parts of the development lifecycle." },
      { heading: "Aligned With Premium Standards", body: "We choose partners who understand that execution detail, responsiveness, and brand consistency matter deeply in premium real estate." }
    ]
  },
  "quick-links/contact-us": {
    title: "Contact Us",
    category: "Quick Links",
    href: "/quick-links/contact-us",
    eyebrow: "Contact Us",
    description: "Connect with Jaguar Properties for buying, investment, vendor, or partnership discussions.",
    intro:
      "Whether you are exploring a home, a plotted investment, a partnership opportunity, or a business collaboration, Jaguar's team is ready to guide the conversation.",
    highlights: ["Buyer support", "Investment discussions", "Responsive outreach"],
    sections: [
      { heading: "How We Help", body: "Our team supports inquiries related to projects, listings, pricing, partnerships, and after-sales communication." },
      { heading: "Reach The Team", body: "Use the dedicated contact page for direct inquiry submission, location details, and map access." }
    ]
  },
  "quick-links/vendor-registration": {
    title: "Vendor Registration",
    category: "Quick Links",
    href: "/quick-links/vendor-registration",
    eyebrow: "Vendor Registration",
    description: "Information for vendors, consultants, and service partners interested in working with Jaguar Properties.",
    intro:
      "Jaguar welcomes capable vendors and professional partners who can contribute to project quality, service consistency, and operational excellence.",
    highlights: ["Vendor onboarding", "Professional standards", "Partnership opportunities"],
    sections: [
      { heading: "Who Should Apply", body: "We engage with contractors, suppliers, consultants, service providers, marketing collaborators, and operational support partners." },
      { heading: "What We Look For", body: "We value credibility, responsiveness, compliance readiness, and an ability to align with premium quality expectations." }
    ]
  },
  "quick-links/privacy-policy": {
    title: "Privacy Policy",
    category: "Quick Links",
    href: "/quick-links/privacy-policy",
    eyebrow: "Privacy Policy",
    description: "How Jaguar Properties approaches user privacy and responsible data handling.",
    intro:
      "Jaguar Properties values transparency and treats customer information with care. We collect only the information needed to support inquiry handling, service communication, and legitimate business processes.",
    highlights: ["Transparent handling", "Responsible data use", "Customer trust"],
    sections: [
      { heading: "Information We Use", body: "We may use submitted contact details to respond to inquiries, share requested information, or support ongoing customer communication." },
      { heading: "Our Commitment", body: "We are committed to handling information responsibly and only within the context of legitimate user engagement and business communication." }
    ]
  }
};

export function getFooterPage(category: string, slug: string) {
  return footerPages[`${category}/${slug}`] ?? null;
}
