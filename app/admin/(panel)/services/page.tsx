import Link from "next/link";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { deleteService } from "@/lib/admin-actions";
import { getServices } from "@/lib/content";

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Mirrors Services</p>
          <h1>Services</h1>
          <p>
            Open a category to add gallery images and subcategory chips visitors
            can filter by.
          </p>
        </div>
        <Link href="/admin/services/new" className="primary-btn">
          Add service
        </Link>
      </div>
      <div className="services-grid">
        {services.map((service) => (
          <article key={service.id} className="admin-item-card">
            <div
              className="admin-thumb"
              style={{ backgroundImage: `url('${service.image}')` }}
            />
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p className="admin-count">
              {service.designCount ?? 0} gallery{" "}
              {(service.designCount ?? 0) === 1 ? "image" : "images"}
              {service.subcategoryCount
                ? ` · ${service.subcategoryCount} ${
                    service.subcategoryCount === 1
                      ? "subcategory"
                      : "subcategories"
                  }`
                : ""}
            </p>
            <div className="admin-item-actions">
              <Link href={`/admin/services/${service.id}`} className="secondary-btn">
                Manage gallery
              </Link>
              <ConfirmDelete
                name={service.title}
                label="service"
                action={deleteService}
                hiddenFields={{ id: service.id }}
              />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
