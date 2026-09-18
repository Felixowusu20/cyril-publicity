import Link from "next/link";
import { notFound } from "next/navigation";
import { DesignForm } from "@/components/admin/DesignForm";
import { getServices, getSubcategories } from "@/lib/content";
import { getPrisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string; designId: string }> };

export default async function EditServiceGalleryPage({ params }: PageProps) {
  const { id, designId } = await params;
  const prisma = getPrisma();
  const [service, row, services, subcategories] = await Promise.all([
    prisma?.service.findUnique({ where: { id } }),
    prisma?.design.findUnique({
      where: { id: designId },
      include: { service: true, subcategory: true },
    }),
    getServices(),
    getSubcategories(id),
  ]);
  if (!service || !row || row.serviceId !== service.id) notFound();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">{service.title}</p>
          <h1>Edit {row.title}</h1>
        </div>
        <Link href={`/admin/services/${service.id}`} className="secondary-btn">
          Back
        </Link>
      </div>
      <DesignForm
        services={services}
        subcategories={subcategories}
        lockedServiceId={service.id}
        returnTo={`/admin/services/${service.id}`}
        design={{
          id: row.id,
          slug: row.slug,
          title: row.title,
          image: row.image,
          alt: row.alt,
          category: row.service.category,
          featured: row.featured,
          sortOrder: row.sortOrder,
          serviceId: row.serviceId,
          subcategoryId: row.subcategoryId,
          subcategoryName: row.subcategory?.name,
          subcategorySlug: row.subcategory?.slug,
        }}
      />
    </>
  );
}
