-- CreateTable
CREATE TABLE "ServiceSubcategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceSubcategory_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Design" ADD COLUMN "subcategoryId" TEXT;

-- CreateIndex
CREATE INDEX "ServiceSubcategory_serviceId_idx" ON "ServiceSubcategory"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceSubcategory_sortOrder_idx" ON "ServiceSubcategory"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceSubcategory_serviceId_slug_key" ON "ServiceSubcategory"("serviceId", "slug");

-- CreateIndex
CREATE INDEX "Design_subcategoryId_idx" ON "Design"("subcategoryId");

-- AddForeignKey
ALTER TABLE "ServiceSubcategory" ADD CONSTRAINT "ServiceSubcategory_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "ServiceSubcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
