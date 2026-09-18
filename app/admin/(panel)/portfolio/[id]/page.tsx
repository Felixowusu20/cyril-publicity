import Link from "next/link";
import { notFound } from "next/navigation";
import { DesignForm } from "@/components/admin/DesignForm";
import { getServices, getSubcategories } from "@/lib/content";
import { getPrisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditDesignPage({ params }: PageProps) {
  const { id } = await params;
  const prisma = getPrisma();
  const [row, services, subcategories] = await Promise.all([
    prisma?.design.findUnique({
      where: { id },
      include: { service: true, subcategory: true },
    }),
    getServices(),
    getSubcategories(),
  ]);
  if (!row) notFound();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Portfolio</p>
          <h1>Edit {row.title}</h1>
        </div>
        <Link href="/admin/portfolio" className="secondary-btn">
          Back
        </Link>
      </div>
      <DesignForm
        services={services}
        subcategories={subcategories}
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
