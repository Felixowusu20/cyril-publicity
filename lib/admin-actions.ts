"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, updateAdminCredentials } from "@/lib/auth";
import { getPrisma, resetPrisma } from "@/lib/prisma";
import { getSettings, type SiteContent } from "@/lib/content";
import { slugify } from "@/lib/slug";

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

async function db() {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    throw new Error("Database is not configured.");
  }
  return prisma;
}

function text(form: FormData, key: string) {
  return String(form.get(key) || "").trim();
}

function bool(form: FormData, key: string) {
  return form.get(key) === "on" || form.get(key) === "true";
}

async function patchSettings(data: Partial<SiteContent>) {
  const prisma = await db();
  const current = await getSettings();
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...current, ...data },
  });
  revalidateSite();
}

export async function saveSettings(formData: FormData) {
  await patchSettings({
    name: text(formData, "name"),
    tagline: text(formData, "tagline"),
    description: text(formData, "description"),
    url: text(formData, "url"),
    location: text(formData, "location"),
    phoneDisplay: text(formData, "phoneDisplay"),
    phoneIntl: text(formData, "phoneIntl"),
    whatsapp: text(formData, "whatsapp"),
    heroKicker: text(formData, "heroKicker"),
    heroTitle: text(formData, "heroTitle"),
    heroAccent: text(formData, "heroAccent"),
    heroLead: text(formData, "heroLead"),
    heroImage: text(formData, "heroImage"),
    heroImageAlt: text(formData, "heroImageAlt"),
    servicesEyebrow: text(formData, "servicesEyebrow"),
    servicesTitle: text(formData, "servicesTitle"),
    servicesDescription: text(formData, "servicesDescription"),
    portfolioEyebrow: text(formData, "portfolioEyebrow"),
    portfolioTitle: text(formData, "portfolioTitle"),
    portfolioDescription: text(formData, "portfolioDescription"),
    processEyebrow: text(formData, "processEyebrow"),
    processTitle: text(formData, "processTitle"),
    pricingEyebrow: text(formData, "pricingEyebrow"),
    pricingTitle: text(formData, "pricingTitle"),
    pricingDescription: text(formData, "pricingDescription"),
    pricingNote: text(formData, "pricingNote"),
    aboutEyebrow: text(formData, "aboutEyebrow"),
    aboutTitle: text(formData, "aboutTitle"),
    aboutIntroTitle: text(formData, "aboutIntroTitle"),
    aboutBody: text(formData, "aboutBody"),
    aboutMission: text(formData, "aboutMission"),
    aboutVision: text(formData, "aboutVision"),
    contactEyebrow: text(formData, "contactEyebrow"),
    contactTitle: text(formData, "contactTitle"),
    contactDescription: text(formData, "contactDescription"),
    contactResponse: text(formData, "contactResponse"),
    ctaTitle: text(formData, "ctaTitle"),
    ctaBody: text(formData, "ctaBody"),
    ctaLabel: text(formData, "ctaLabel"),
  });
}

export async function saveHero(formData: FormData) {
  await patchSettings({
    heroKicker: text(formData, "heroKicker"),
    heroTitle: text(formData, "heroTitle"),
    heroAccent: text(formData, "heroAccent"),
    heroLead: text(formData, "heroLead"),
    heroImage: text(formData, "heroImage"),
    heroImageAlt: text(formData, "heroImageAlt"),
  });
  redirect("/admin");
}

export async function saveService(formData: FormData) {
  const prisma = await db();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const data = {
    title,
    slug,
    category: text(formData, "category") || title,
    description: text(formData, "description"),
    details: text(formData, "details"),
    image: text(formData, "image") || "/images/flyer-design.png",
    sortOrder: Number(text(formData, "sortOrder") || 0),
  };

  if (id) {
    await prisma.service.update({ where: { id }, data });
  } else {
    await prisma.service.create({ data });
  }
  revalidateSite();
  redirect(id ? `/admin/services/${id}` : "/admin/services");
}

export async function deleteService(formData: FormData) {
  const prisma = await db();
  await prisma.service.delete({ where: { id: text(formData, "id") } });
  revalidateSite();
}

export async function saveDesign(formData: FormData) {
  const prisma = await db();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const subcategoryId = text(formData, "subcategoryId") || null;
  const returnTo = text(formData, "returnTo") || "/admin/portfolio";
  const data = {
    title,
    slug,
    image: text(formData, "image") || "/images/flyer-design.png",
    alt: text(formData, "alt") || title,
    featured: bool(formData, "featured"),
    sortOrder: Number(text(formData, "sortOrder") || 0),
    serviceId: text(formData, "serviceId"),
    subcategoryId,
  };

  if (id) {
    await prisma.design.update({ where: { id }, data });
  } else {
    await prisma.design.create({ data });
  }
  revalidateSite();
  redirect(returnTo.startsWith("/admin") ? returnTo : "/admin/portfolio");
}

export async function saveGalleryBatch(formData: FormData) {
  const serviceId = text(formData, "serviceId");
  const subcategoryId = text(formData, "subcategoryId") || null;
  const returnTo = text(formData, "returnTo") || `/admin/services/${serviceId}`;
  const images = formData
    .getAll("images")
    .map((value) => String(value || "").trim())
    .filter(Boolean);
  const titles = formData
    .getAll("titles")
    .map((value) => String(value || "").trim());

  if (!serviceId || images.length === 0) {
    redirect(returnTo.startsWith("/admin") ? returnTo : "/admin/services");
  }

  async function createBatch() {
    const prisma = await db();
    const existingCount = await prisma.design.count({ where: { serviceId } });
    const usedSlugs = new Set(
      (await prisma.design.findMany({ select: { slug: true } })).map((row) => row.slug),
    );

    const rows = images.map((image, index) => {
      const title = titles[index] || `Gallery ${existingCount + index + 1}`;
      let slug = slugify(title) || `design-${Date.now()}-${index}`;
      while (usedSlugs.has(slug)) {
        slug = `${slugify(title) || "design"}-${Math.random().toString(36).slice(2, 6)}`;
      }
      usedSlugs.add(slug);
      return {
        title,
        slug,
        image,
        alt: title,
        featured: false,
        sortOrder: existingCount + index,
        serviceId,
        subcategoryId,
      };
    });

    for (const data of rows) {
      await prisma.design.create({ data });
    }
  }

  try {
    await createBatch();
  } catch {
    resetPrisma();
    await createBatch();
  }

  revalidateSite();
  redirect(returnTo.startsWith("/admin") ? returnTo : `/admin/services/${serviceId}`);
}

export async function deleteDesign(formData: FormData) {
  const prisma = await db();
  await prisma.design.delete({ where: { id: text(formData, "id") } });
  revalidateSite();
}

export async function saveSubcategory(formData: FormData) {
  const prisma = await db();
  const serviceId = text(formData, "serviceId");
  const name = text(formData, "name");
  if (!serviceId || !name) {
    redirect(`/admin/services/${serviceId || ""}`);
  }
  const slug = slugify(name) || `sub-${Date.now()}`;
  await prisma.serviceSubcategory.upsert({
    where: { serviceId_slug: { serviceId, slug } },
    update: { name },
    create: {
      name,
      slug,
      serviceId,
      sortOrder: Number(text(formData, "sortOrder") || 0),
    },
  });
  revalidateSite();
  redirect(`/admin/services/${serviceId}`);
}

export async function deleteSubcategory(formData: FormData) {
  const prisma = await db();
  await prisma.serviceSubcategory.delete({ where: { id: text(formData, "id") } });
  revalidateSite();
}

export async function savePricePlan(formData: FormData) {
  const prisma = await db();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const includes = text(formData, "includes")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const data = {
    title,
    slug,
    summary: text(formData, "summary"),
    featured: bool(formData, "featured"),
    includes,
    sortOrder: Number(text(formData, "sortOrder") || 0),
  };

  if (id) {
    await prisma.pricePlan.update({ where: { id }, data });
  } else {
    await prisma.pricePlan.create({ data });
  }
  revalidateSite();
  redirect("/admin/pricing");
}

export async function deletePricePlan(formData: FormData) {
  const prisma = await db();
  await prisma.pricePlan.delete({ where: { id: text(formData, "id") } });
  revalidateSite();
}

export async function saveProcessStep(formData: FormData) {
  const prisma = await db();
  const id = text(formData, "id");
  const data = {
    step: text(formData, "step"),
    title: text(formData, "title"),
    body: text(formData, "body"),
    sortOrder: Number(text(formData, "sortOrder") || 0),
  };

  if (id) {
    await prisma.processStep.update({ where: { id }, data });
  } else {
    await prisma.processStep.create({ data });
  }
  revalidateSite();
  redirect("/admin/process");
}

export async function deleteProcessStep(formData: FormData) {
  const prisma = await db();
  await prisma.processStep.delete({ where: { id: text(formData, "id") } });
  revalidateSite();
}

export async function saveAbout(formData: FormData) {
  await patchSettings({
    aboutEyebrow: text(formData, "aboutEyebrow"),
    aboutTitle: text(formData, "aboutTitle"),
    aboutIntroTitle: text(formData, "aboutIntroTitle"),
    aboutBody: text(formData, "aboutBody"),
    aboutMission: text(formData, "aboutMission"),
    aboutVision: text(formData, "aboutVision"),
  });
  redirect("/admin/about");
}

export async function saveContact(formData: FormData) {
  await patchSettings({
    contactEyebrow: text(formData, "contactEyebrow"),
    contactTitle: text(formData, "contactTitle"),
    contactDescription: text(formData, "contactDescription"),
    contactResponse: text(formData, "contactResponse"),
    location: text(formData, "location"),
    phoneDisplay: text(formData, "phoneDisplay"),
    phoneIntl: text(formData, "phoneIntl"),
    whatsapp: text(formData, "whatsapp"),
  });
  redirect("/admin/contact");
}

export async function saveCta(formData: FormData) {
  await patchSettings({
    ctaTitle: text(formData, "ctaTitle"),
    ctaBody: text(formData, "ctaBody"),
    ctaLabel: text(formData, "ctaLabel"),
  });
  redirect("/admin");
}

export async function saveHomeCopy(formData: FormData) {
  await patchSettings({
    servicesEyebrow: text(formData, "servicesEyebrow"),
    servicesTitle: text(formData, "servicesTitle"),
    portfolioEyebrow: text(formData, "portfolioEyebrow"),
    portfolioTitle: text(formData, "portfolioTitle"),
    processEyebrow: text(formData, "processEyebrow"),
    processTitle: text(formData, "processTitle"),
  });
  redirect("/admin");
}

export async function savePricingCopy(formData: FormData) {
  await patchSettings({
    pricingEyebrow: text(formData, "pricingEyebrow"),
    pricingTitle: text(formData, "pricingTitle"),
    pricingDescription: text(formData, "pricingDescription"),
    pricingNote: text(formData, "pricingNote"),
  });
  redirect("/admin/pricing");
}

export async function saveBrand(formData: FormData) {
  await patchSettings({
    name: text(formData, "name"),
    tagline: text(formData, "tagline"),
    description: text(formData, "description"),
    url: text(formData, "url"),
    location: text(formData, "location"),
    phoneDisplay: text(formData, "phoneDisplay"),
    phoneIntl: text(formData, "phoneIntl"),
    whatsapp: text(formData, "whatsapp"),
  });
  redirect("/admin/settings");
}

export async function saveAccount(
  _prev: { error?: string; ok?: boolean } | null,
  formData: FormData,
) {
  const result = await updateAdminCredentials({
    email: text(formData, "email"),
    currentPassword: text(formData, "currentPassword"),
    newPassword: text(formData, "newPassword") || undefined,
  });
  if ("error" in result && result.error) {
    return { error: result.error };
  }
  revalidatePath("/admin/settings");
  return { ok: true };
}
