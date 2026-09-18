-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "phoneDisplay" TEXT NOT NULL,
    "phoneIntl" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "heroKicker" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroAccent" TEXT NOT NULL,
    "heroLead" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "heroImageAlt" TEXT NOT NULL,
    "servicesEyebrow" TEXT NOT NULL,
    "servicesTitle" TEXT NOT NULL,
    "servicesDescription" TEXT NOT NULL,
    "portfolioEyebrow" TEXT NOT NULL,
    "portfolioTitle" TEXT NOT NULL,
    "portfolioDescription" TEXT NOT NULL,
    "processEyebrow" TEXT NOT NULL,
    "processTitle" TEXT NOT NULL,
    "pricingEyebrow" TEXT NOT NULL,
    "pricingTitle" TEXT NOT NULL,
    "pricingDescription" TEXT NOT NULL,
    "pricingNote" TEXT NOT NULL,
    "aboutEyebrow" TEXT NOT NULL,
    "aboutTitle" TEXT NOT NULL,
    "aboutIntroTitle" TEXT NOT NULL,
    "aboutBody" TEXT NOT NULL,
    "aboutMission" TEXT NOT NULL,
    "aboutVision" TEXT NOT NULL,
    "contactEyebrow" TEXT NOT NULL,
    "contactTitle" TEXT NOT NULL,
    "contactDescription" TEXT NOT NULL,
    "contactResponse" TEXT NOT NULL,
    "ctaTitle" TEXT NOT NULL,
    "ctaBody" TEXT NOT NULL,
    "ctaLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricePlan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "includes" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessStep" (
    "id" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_sortOrder_idx" ON "Service"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Design_slug_key" ON "Design"("slug");

-- CreateIndex
CREATE INDEX "Design_serviceId_idx" ON "Design"("serviceId");

-- CreateIndex
CREATE INDEX "Design_featured_idx" ON "Design"("featured");

-- CreateIndex
CREATE INDEX "Design_sortOrder_idx" ON "Design"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PricePlan_slug_key" ON "PricePlan"("slug");

-- CreateIndex
CREATE INDEX "PricePlan_sortOrder_idx" ON "PricePlan"("sortOrder");

-- CreateIndex
CREATE INDEX "ProcessStep_sortOrder_idx" ON "ProcessStep"("sortOrder");

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
