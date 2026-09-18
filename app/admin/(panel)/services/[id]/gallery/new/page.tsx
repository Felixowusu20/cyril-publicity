import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryBatchForm } from "@/components/admin/GalleryBatchForm";
import { getSubcategories } from "@/lib/content";
import { getPrisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function NewServiceGalleryPage({ params }: PageProps) {
  const { id } = await params;
  const prisma = getPrisma();
  const [service, subcategories] = await Promise.all([
    prisma?.service.findUnique({ where: { id } }),
    getSubcategories(id),
  ]);
  if (!service) notFound();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">{service.title}</p>
          <h1>Add gallery images</h1>
        </div>
        <Link href={`/admin/services/${service.id}`} className="secondary-btn">
          Back
        </Link>
      </div>
      <GalleryBatchForm
        serviceId={service.id}
        subcategories={subcategories}
        returnTo={`/admin/services/${service.id}`}
      />
    </>
  );
}
