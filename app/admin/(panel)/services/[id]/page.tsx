import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { GalleryBatchForm } from "@/components/admin/GalleryBatchForm";
import { ServiceForm } from "@/components/admin/ServiceForm";
import {
  deleteDesign,
  deleteSubcategory,
  saveSubcategory,
} from "@/lib/admin-actions";
import { getPrisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  const prisma = getPrisma();
  const service = prisma
    ? await prisma.service.findUnique({
        where: { id },
        include: {
          subcategories: { orderBy: { sortOrder: "asc" } },
          designs: {
            orderBy: { sortOrder: "asc" },
            include: { subcategory: true },
          },
        },
      })
    : null;
  if (!service) notFound();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Services</p>
          <h1>{service.title}</h1>
        </div>
        <Link href="/admin/services" className="secondary-btn">
          Back
        </Link>
      </div>

      <section className="admin-preview-block">
        <div className="admin-preview-bar">
          <strong>Category details</strong>
        </div>
        <ServiceForm service={service} />
      </section>

      <section className="admin-preview-block">
        <div className="admin-preview-bar">
          <strong>Subcategories</strong>
        </div>
        <p>
          Visitors can filter this gallery with these chips, for example Business,
          Events or Church.
        </p>
        <form action={saveSubcategory} className="admin-inline-form">
          <input type="hidden" name="serviceId" value={service.id} />
          <input name="name" placeholder="Subcategory name" required />
          <button type="submit" className="primary-btn">
            Add subcategory
          </button>
        </form>
        {service.subcategories.length === 0 ? (
          <p className="gallery-empty">No subcategories yet. The full gallery still shows.</p>
        ) : (
          <ul className="admin-chip-list">
            {service.subcategories.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <ConfirmDelete
                  name={item.name}
                  label="subcategory"
                  action={deleteSubcategory}
                  hiddenFields={{ id: item.id }}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="admin-preview-block">
        <div className="admin-preview-bar">
          <strong>Gallery · {service.designs.length}</strong>
        </div>
        <p>
          Choose several images at once. They will all appear on the{" "}
          {service.title} page.
        </p>
        <GalleryBatchForm
          serviceId={service.id}
          subcategories={service.subcategories}
          returnTo={`/admin/services/${service.id}`}
        />
        {service.designs.length === 0 ? (
          <p className="gallery-empty">
            No gallery images yet. Select multiple files above to add them.
          </p>
        ) : (
          <div className="admin-mini-grid">
            {service.designs.map((item) => (
              <article key={item.id} className="admin-item-card">
                <div
                  className="admin-thumb"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <h3>{item.title}</h3>
                <p>{item.subcategory?.name || "All of this category"}</p>
                <div className="admin-item-actions">
                  <Link
                    href={`/admin/services/${service.id}/gallery/${item.id}`}
                    className="secondary-btn"
                  >
                    Edit
                  </Link>
                  <ConfirmDelete
                    name={item.title}
                    label="gallery image"
                    action={deleteDesign}
                    hiddenFields={{ id: item.id }}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
