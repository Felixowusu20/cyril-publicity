import { ImageField } from "@/components/admin/ImageField";
import type { ServiceRecord } from "@/lib/content";
import { saveService } from "@/lib/admin-actions";

export function ServiceForm({ service }: { service?: ServiceRecord }) {
  return (
    <form action={saveService} className="admin-form">
      {service ? <input type="hidden" name="id" value={service.id} /> : null}
      <label>
        Title
        <input name="title" defaultValue={service?.title} required />
      </label>
      <label>
        Slug
        <input name="slug" defaultValue={service?.slug} placeholder="flyer-design" />
      </label>
      <label>
        Category
        <input name="category" defaultValue={service?.category} required />
      </label>
      <label>
        Short description
        <textarea name="description" defaultValue={service?.description} required />
      </label>
      <label>
        Details
        <textarea name="details" defaultValue={service?.details} required />
      </label>
      <ImageField name="image" label="Cover image" defaultValue={service?.image} />
      <label>
        Sort order
        <input name="sortOrder" type="number" defaultValue={0} />
      </label>
      <button type="submit" className="primary-btn">
        {service ? "Save service" : "Add service"}
      </button>
    </form>
  );
}
