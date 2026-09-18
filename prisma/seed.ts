import "../lib/load-env";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  portfolio,
  pricing,
  processSteps,
  services,
} from "../lib/data";
import { site } from "../lib/site";
import { slugify } from "../lib/slug";

const defaultSubcategories: Record<string, string[]> = {
  "flyer-design": ["Business", "Events", "Church"],
  "logo-design": ["Brand", "Personal"],
  "social-media-design": ["Campaigns", "Church", "Business"],
  "poster-design": ["Funeral", "Concert", "Church"],
  "business-cards": ["Corporate"],
  "event-graphics": ["Tickets", "Wedding", "Church"],
};

const designSubcategories: Record<string, string> = {
  "mpaboa-flyer": "business",
  "dashway-logo": "brand",
  "gscs-social": "campaigns",
  "funeral-poster": "funeral",
  "wearpoks-card": "corporate",
  "ignition-ticket": "tickets",
  "gospel-power": "church",
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Add it to .env or .env.local.",
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "change-me";
  const passwordHash = await bcrypt.hash(password, 12);

  const existingAdmin = await prisma.admin.findFirst();
  if (!existingAdmin) {
    await prisma.admin.create({
      data: { email, passwordHash },
    });
    console.log(`Created admin ${email}`);
  } else {
    console.log(`Admin already exists (${existingAdmin.email}). Skipping user seed.`);
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: site.name,
      tagline: site.tagline,
      description: site.description,
      url: site.url,
      location: site.location,
      phoneDisplay: site.phoneDisplay,
      phoneIntl: site.phoneIntl,
      whatsapp: site.whatsapp,
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
      aboutBody: `${site.name} is a creative graphic design studio focused on professional, visually appealing work for businesses, organisations, events and individuals.\n\nFrom flyers and logos to social media graphics and event designs, we turn ideas into compelling visual experiences.`,
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
    },
  });

  for (const [index, service] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        category: service.category,
        description: service.description,
        details: service.details,
        image: service.image,
        sortOrder: index,
      },
      create: {
        slug: service.slug,
        title: service.title,
        category: service.category,
        description: service.description,
        details: service.details,
        image: service.image,
        sortOrder: index,
      },
    });
  }

  const dbServices = await prisma.service.findMany({
    include: { subcategories: true },
  });
  const serviceByCategory = new Map(
    dbServices.map((service) => [service.category, service]),
  );

  for (const service of dbServices) {
    const names = defaultSubcategories[service.slug] || [];
    if (service.subcategories.length > 0 || names.length === 0) continue;
    await prisma.serviceSubcategory.createMany({
      data: names.map((name, index) => ({
        name,
        slug: slugify(name),
        serviceId: service.id,
        sortOrder: index,
      })),
    });
  }

  const subcategories = await prisma.serviceSubcategory.findMany();
  const subcategoryByKey = new Map(
    subcategories.map((item) => [`${item.serviceId}:${item.slug}`, item]),
  );

  for (const [index, item] of portfolio.entries()) {
    const service = serviceByCategory.get(item.category);
    if (!service) continue;
    const subSlug = designSubcategories[item.slug];
    const subcategory = subSlug
      ? subcategoryByKey.get(`${service.id}:${subSlug}`)
      : undefined;

    const existing = await prisma.design.findUnique({
      where: { slug: item.slug },
    });

    await prisma.design.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        image: item.image,
        alt: item.alt,
        featured: index < 6,
        sortOrder: index,
        serviceId: service.id,
        subcategoryId: existing?.subcategoryId ?? subcategory?.id ?? null,
      },
      create: {
        slug: item.slug,
        title: item.title,
        image: item.image,
        alt: item.alt,
        featured: index < 6,
        sortOrder: index,
        serviceId: service.id,
        subcategoryId: subcategory?.id ?? null,
      },
    });
  }

  for (const [index, plan] of pricing.entries()) {
    await prisma.pricePlan.upsert({
      where: { slug: plan.slug },
      update: {
        title: plan.title,
        summary: plan.summary,
        featured: Boolean(plan.featured),
        includes: plan.includes,
        sortOrder: index,
      },
      create: {
        slug: plan.slug,
        title: plan.title,
        summary: plan.summary,
        featured: Boolean(plan.featured),
        includes: plan.includes,
        sortOrder: index,
      },
    });
  }

  const stepCount = await prisma.processStep.count();
  if (stepCount === 0) {
    await prisma.processStep.createMany({
      data: processSteps.map((item, index) => ({
        step: item.step,
        title: item.title,
        body: item.body,
        sortOrder: index,
      })),
    });
  }

  console.log("Seed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
