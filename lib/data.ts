export type Service = {
  slug: string;
  title: string;
  category: string;
  description: string;
  details: string;
  image: string;
};

export type PortfolioItem = {
  slug: string;
  title: string;
  category: string;
  image: string;
  alt: string;
};

export type PricePlan = {
  slug: string;
  title: string;
  summary: string;
  featured?: boolean;
  includes: string[];
};

export const services: Service[] = [
  {
    slug: "flyer-design",
    title: "Flyer Design",
    category: "Flyer Design",
    description: "Creative flyers for businesses, events and promotions.",
    details:
      "Bold layouts, clear messaging and print-ready files for promotions, launches and campus events.",
    image: "/images/flyer-design.png",
  },
  {
    slug: "logo-design",
    title: "Logo Design",
    category: "Logo Design",
    description: "Professional logos that represent your brand.",
    details:
      "Distinctive marks, colour systems and usage-ready files so your brand looks consistent everywhere.",
    image: "/images/logo-design.png",
  },
  {
    slug: "social-media-design",
    title: "Social Media Design",
    category: "Social Media",
    description: "Eye-catching graphics for your social media platforms.",
    details:
      "Posts, covers and campaign visuals sized for Instagram, Facebook, X and more.",
    image: "/images/social-media.png",
  },
  {
    slug: "poster-design",
    title: "Poster Design",
    category: "Poster Design",
    description: "Professional posters for events and promotions.",
    details:
      "High-impact posters for funerals, concerts, church programmes and public notices.",
    image: "/images/poster-design.png",
  },
  {
    slug: "business-cards",
    title: "Business Cards",
    category: "Business Design",
    description: "Clean and professional business card designs.",
    details:
      "Print-ready cards with your contacts, offer and brand identity on a layout that feels premium.",
    image: "/images/business-card.png",
  },
  {
    slug: "event-graphics",
    title: "Event Graphics",
    category: "Event Design",
    description: "Beautiful graphics for weddings, churches and events.",
    details:
      "Invites, tickets, certificates and event branding that make the day feel coordinated.",
    image: "/images/event-card.jpg",
  },
];

export const portfolio: PortfolioItem[] = [
  {
    slug: "mpaboa-flyer",
    title: "Dr. Mpaboa Flyer",
    category: "Flyer Design",
    image: "/images/flyer-design.png",
    alt: "Product flyer for Dr. Mpaboa sneakers with white shoes on a warm brown background.",
  },
  {
    slug: "dashway-logo",
    title: "Dashway Logo",
    category: "Logo Design",
    image: "/images/logo-design.png",
    alt: "White Dashway logo with a crown and road forming the letter A on a dark red background.",
  },
  {
    slug: "gscs-social",
    title: "GSCS Social Campaign",
    category: "Social Media",
    image: "/images/social-media.png",
    alt: "Social media follow graphic for GSCS KNUST showing a phone and campus branding.",
  },
  {
    slug: "funeral-poster",
    title: "Funeral Poster",
    category: "Poster Design",
    image: "/images/poster-design.png",
    alt: "Funeral arrangement poster for Patricia Serwaa with portrait, date and venue details.",
  },
  {
    slug: "wearpoks-card",
    title: "Wear Poks Card",
    category: "Business Design",
    image: "/images/business-card.png",
    alt: "Business card for Wear Poks Vault featuring vintage shirt branding and contact details.",
  },
  {
    slug: "ignition-ticket",
    title: "Ignition Event Card",
    category: "Event Design",
    image: "/images/event-card.jpg",
    alt: "Green Ignition event tickets with gold lettering, QR code and 17 October 2025 date.",
  },
  {
    slug: "gospel-power",
    title: "Gospel & Power Conference",
    category: "Social Media",
    image: "/images/conference-design.jpg",
    alt: "Conference graphic for PENSA Ghana Gospel and Power with a pastor speaking on stage.",
  },
];

export const pricing: PricePlan[] = [
  {
    slug: "flyer-design",
    title: "Flyer Design",
    summary: "Professional flyer design for promotions, sales and events.",
    includes: ["Custom layout", "Print and digital files", "Revisions included"],
  },
  {
    slug: "logo-design",
    title: "Logo Design",
    summary: "A professional brand mark built around your business.",
    featured: true,
    includes: ["Concept exploration", "Final logo files", "Simple brand usage"],
  },
  {
    slug: "social-media-design",
    title: "Social Media Design",
    summary: "Graphics sized and styled for your social platforms.",
    includes: ["Platform-ready sizes", "On-brand visuals", "Campaign options"],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getDesignsForService(slug: string): PortfolioItem[] {
  const service = getServiceBySlug(slug);
  if (!service) return [];

  const items = portfolio.filter((item) => item.category === service.category);
  if (items.length > 0) return items;

  return [
    {
      slug: service.slug,
      title: service.title,
      category: service.category,
      image: service.image,
      alt: service.title,
    },
  ];
}

export const processSteps = [
  {
    step: "01",
    title: "Submit Your Order",
    body: "Tell us what design you need, your deadline and any references.",
  },
  {
    step: "02",
    title: "We Design",
    body: "We create your design based on your brief and brand direction.",
  },
  {
    step: "03",
    title: "Review",
    body: "Review the design and request revisions until it feels right.",
  },
  {
    step: "04",
    title: "Receive Your Design",
    body: "Get your final high-quality files, ready to print or post.",
  },
];
