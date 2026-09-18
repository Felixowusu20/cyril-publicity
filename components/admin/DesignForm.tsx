"use client";

import { useMemo, useState } from "react";
import { ImageField } from "@/components/admin/ImageField";
import { saveDesign } from "@/lib/admin-actions";
import type { DesignRecord, ServiceRecord, SubcategoryRecord } from "@/lib/content";

export function DesignForm({
  design,
  services,
  subcategories = [],
  lockedServiceId,
  returnTo = "/admin/portfolio",
}: {
  design?: DesignRecord;
  services: ServiceRecord[];
  subcategories?: SubcategoryRecord[];
  lockedServiceId?: string;
  returnTo?: string;
}) {
  const [serviceId, setServiceId] = useState(
    lockedServiceId || design?.serviceId || "",
  );
  const visibleSubs = useMemo(
    () => subcategories.filter((item) => item.serviceId === serviceId),
    [subcategories, serviceId],
  );

  return (
    <form action={saveDesign} className="admin-form">
      {design ? <input type="hidden" name="id" value={design.id} /> : null}
      <input type="hidden" name="returnTo" value={returnTo} />
      {lockedServiceId ? (
        <input type="hidden" name="serviceId" value={lockedServiceId} />
      ) : null}
      <label>
        Title
        <input name="title" defaultValue={design?.title} required />
      </label>
      <label>
        Slug
        <input name="slug" defaultValue={design?.slug} />
      </label>
      {lockedServiceId ? null : (
        <label>
          Service category
          <select
            name="serviceId"
            value={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
            required
          >
            <option value="" disabled>
              Select a service
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
      )}
      <label>
        Subcategory
        <select
          key={serviceId}
          name="subcategoryId"
          defaultValue={
            design?.serviceId === serviceId ? (design?.subcategoryId ?? "") : ""
          }
        >
          <option value="">All of this category</option>
          {visibleSubs.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      {visibleSubs.length === 0 ? (
        <p className="gallery-empty">
          Add subcategory chips on the service first if you want to group this
          image, for example Business, Events or Church.
        </p>
      ) : null}
      <label>
        Alt text
        <input name="alt" defaultValue={design?.alt} required />
      </label>
      <ImageField name="image" label="Design image" defaultValue={design?.image} />
      <label className="admin-check">
        <input name="featured" type="checkbox" defaultChecked={design?.featured} />
        Show in featured homepage gallery
      </label>
      <label>
        Sort order
        <input
          name="sortOrder"
          type="number"
          defaultValue={design?.sortOrder ?? 0}
        />
      </label>
      <button type="submit" className="primary-btn">
        {design ? "Save gallery image" : "Add gallery image"}
      </button>
    </form>
  );
}
