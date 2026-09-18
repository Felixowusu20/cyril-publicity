import {
  portfolio as fallbackPortfolio,
  pricing as fallbackPricing,
  processSteps as fallbackProcess,
  services as fallbackServices,
  type PortfolioItem,
  type PricePlan,
  type Service,
} from "@/lib/data";
import { getPrisma } from "@/lib/prisma";
import { site as fallbackSite } from "@/lib/site";

export type SiteContent = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  location: string;
  phoneDisplay: string;
  phoneIntl: string;
  whatsapp: string;
  heroKicker: string;
  heroTitle: string;
  heroAccent: string;
  heroLead: string;
  heroImage: string;
  heroImageAlt: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesDescription: string;
  portfolioEyebrow: string;
  portfolioTitle: string;
  portfolioDescription: string;
  processEyebrow: string;
  processTitle: string;
  pricingEyebrow: string;
  pricingTitle: string;
  pricingDescription: string;
  pricingNote: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutIntroTitle: string;
  aboutBody: string;
  aboutMission: string;
  aboutVision: string;
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
  contactResponse: string;
  ctaTitle: string;
  ctaBody: string;
  ctaLabel: string;
};

export type DesignRecord = PortfolioItem & {
  id: string;
  featured: boolean;
  sortOrder?: number;
  serviceId: string;
  subcategoryId?: string | null;
  subcategoryName?: string | null;
  subcategorySlug?: string | null;
};

export type ServiceRecord = Service & {
  id: string;
  designCount?: number;
  subcategoryCount?: number;
};

export type SubcategoryRecord = {
  id: string;
  name: string;
  slug: string;
  serviceId: string;
};

export type PriceRecord = PricePlan & {
  id: string;
};

export type ProcessRecord = {
  id: string;
  step: string;
  title: string;
  body: string;
};

const defaultSettings: SiteContent = {
  name: fallbackSite.name,
  tagline: fallbackSite.tagline,
  description: fallbackSite.description,
  url: fallbackSite.url,
  location: fallbackSite.location,
  phoneDisplay: fallbackSite.phoneDisplay,
  phoneIntl: fallbackSite.phoneIntl,
  whatsapp: fallbackSite.whatsapp,
  heroKicker: "Graphic Design Studio",
  heroTitle: "We turn ideas into",
  heroAccent: "visual experiences.",
  heroLead:
    "Flyers, logos, posters and social designs for businesses, events and brands.",
  heroImage: "/images/hero.png",
  heroImageAlt:
    "CyrilPublicity promotional portrait offering social media, flyer, poster and certificate design. Tel 059 637 5191.",
  servicesEyebrow: "WHAT WE DO",
  servicesTitle: "Our Services",
  servicesDescription:
    "Choose a category to see designs from that service. Tap any design to view it fullscreen.",
  portfolioEyebrow: "OUR WORK",
  portfolioTitle: "Featured Portfolio",
  portfolioDescription:
    "Explore some of our creative work for businesses, events and organisations.",
  processEyebrow: "SIMPLE PROCESS",
  processTitle: "How It Works",
  pricingEyebrow: "SIMPLE & TRANSPARENT",
  pricingTitle: "Pricing",
  pricingDescription:
    "Affordable design solutions. Share your brief and we will confirm a quote.",
  pricingNote:
    "Starting prices depend on the brief, revisions and delivery format. You will get a clear quote before work begins.",
  aboutEyebrow: "WHO WE ARE",
  aboutTitle: "About Us",
  aboutIntroTitle: "CREATIVE DESIGNS",
  aboutBody: `${fallbackSite.name} is a creative graphic design studio focused on professional, visually appealing work for businesses, organisations, events and individuals.\n\nFrom flyers and logos to social media graphics and event designs, we turn ideas into compelling visual experiences.`,
  aboutMission:
    "To provide creative, professional and affordable graphic design solutions.",
  aboutVision:
    "To become a trusted creative design brand known for quality, creativity and reliability.",
  contactEyebrow: "GET IN TOUCH",
  contactTitle: "Contact Us",
  contactDescription:
    "WhatsApp is the fastest way to reach us. Call, send a message, or start an order when you are ready.",
  contactResponse: "Usually same day",
  ctaTitle: "Have a Design Project in Mind?",
  ctaBody: "Let's bring your idea to life.",
  ctaLabel: "Start Your Order",
};

export async function getSettings(): Promise<SiteContent> {
  const prisma = getPrisma();
  if (!prisma) return defaultSettings;

  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (!row) return defaultSettings;
    const { id: _id, createdAt: _c, updatedAt: _u, ...settings } = row;
    return settings;
  } catch {
    return defaultSettings;
  }
}

export async function getServices(): Promise<ServiceRecord[]> {
  const prisma = getPrisma();
  if (!prisma) {
    return fallbackServices.map((service, index) => ({
      ...service,
      id: `fallback-service-${index}`,
    }));
  }

  try {
    const rows = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { designs: true, subcategories: true } },
      },
    });
    if (rows.length === 0) {
      return fallbackServices.map((service, index) => ({
        ...service,
        id: `fallback-service-${index}`,
      }));
    }
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      description: row.description,
      details: row.details,
      image: row.image,
      designCount: row._count.designs,
      subcategoryCount: row._count.subcategories,
    }));
  } catch {
    return fallbackServices.map((service, index) => ({
      ...service,
      id: `fallback-service-${index}`,
    }));
  }
}

export async function getServiceBySlug(slug: string) {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}

export async function getDesigns(): Promise<DesignRecord[]> {
  const prisma = getPrisma();
  if (!prisma) {
    return fallbackPortfolio.map((item, index) => ({
      ...item,
      id: `fallback-design-${index}`,
      featured: index < 6,
      serviceId: "",
    }));
  }

  try {
    const rows = await prisma.design.findMany({
      orderBy: { sortOrder: "asc" },
      include: { service: true, subcategory: true },
    });
    if (rows.length === 0) {
      return fallbackPortfolio.map((item, index) => ({
        ...item,
        id: `fallback-design-${index}`,
        featured: index < 6,
        serviceId: "",
      }));
    }
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.service.category,
      image: row.image,
      alt: row.alt,
      featured: row.featured,
      sortOrder: row.sortOrder,
      serviceId: row.serviceId,
      subcategoryId: row.subcategoryId,
      subcategoryName: row.subcategory?.name ?? null,
      subcategorySlug: row.subcategory?.slug ?? null,
    }));
  } catch {
    return fallbackPortfolio.map((item, index) => ({
      ...item,
      id: `fallback-design-${index}`,
      featured: index < 6,
      serviceId: "",
    }));
  }
}

export async function getFeaturedDesigns() {
  const designs = await getDesigns();
  const featured = designs.filter((item) => item.featured);
  return featured.length > 0 ? featured.slice(0, 6) : designs.slice(0, 6);
}

export async function getDesignsForService(
  slug: string,
  subcategorySlug?: string,
): Promise<DesignRecord[]> {
  const service = await getServiceBySlug(slug);
  if (!service) return [];

  const designs = (await getDesigns()).filter(
    (item) => item.category === service.category || item.serviceId === service.id,
  );

  if (subcategorySlug) {
    return designs.filter((item) => item.subcategorySlug === subcategorySlug);
  }

  if (designs.length > 0) return designs;

  return [
    {
      id: service.id,
      slug: service.slug,
      title: service.title,
      category: service.category,
      image: service.image,
      alt: service.title,
      featured: false,
      serviceId: service.id,
    },
  ];
}

export async function getSubcategories(serviceId?: string): Promise<SubcategoryRecord[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  try {
    const rows = await prisma.serviceSubcategory.findMany({
      where: serviceId ? { serviceId } : undefined,
      orderBy: { sortOrder: "asc" },
    });
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      serviceId: row.serviceId,
    }));
  } catch {
    return [];
  }
}

export async function getPricePlans(): Promise<PriceRecord[]> {
  const prisma = getPrisma();
  if (!prisma) {
    return fallbackPricing.map((plan, index) => ({
      ...plan,
      id: `fallback-price-${index}`,
    }));
  }

  try {
    const rows = await prisma.pricePlan.findMany({ orderBy: { sortOrder: "asc" } });
    if (rows.length === 0) {
      return fallbackPricing.map((plan, index) => ({
        ...plan,
        id: `fallback-price-${index}`,
      }));
    }
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      featured: row.featured,
      includes: row.includes,
    }));
  } catch {
    return fallbackPricing.map((plan, index) => ({
      ...plan,
      id: `fallback-price-${index}`,
    }));
  }
}

export async function getProcessSteps(): Promise<ProcessRecord[]> {
  const prisma = getPrisma();
  if (!prisma) {
    return fallbackProcess.map((item, index) => ({ ...item, id: `fallback-step-${index}` }));
  }

  try {
    const rows = await prisma.processStep.findMany({ orderBy: { sortOrder: "asc" } });
    if (rows.length === 0) {
      return fallbackProcess.map((item, index) => ({
        ...item,
        id: `fallback-step-${index}`,
      }));
    }
    return rows.map((row) => ({
      id: row.id,
      step: row.step,
      title: row.title,
      body: row.body,
    }));
  } catch {
    return fallbackProcess.map((item, index) => ({
      ...item,
      id: `fallback-step-${index}`,
    }));
  }
}
