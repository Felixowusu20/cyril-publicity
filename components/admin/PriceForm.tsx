import { savePricePlan } from "@/lib/admin-actions";
import type { PriceRecord } from "@/lib/content";

export function PriceForm({ plan }: { plan?: PriceRecord }) {
  return (
    <form action={savePricePlan} className="admin-form">
      {plan ? <input type="hidden" name="id" value={plan.id} /> : null}
      <label>
        Title
        <input name="title" defaultValue={plan?.title} required />
      </label>
      <label>
        Slug
        <input name="slug" defaultValue={plan?.slug} />
      </label>
      <label>
        Summary
        <textarea name="summary" defaultValue={plan?.summary} required />
      </label>
      <label>
        Includes (one per line)
        <textarea
          name="includes"
          defaultValue={plan?.includes.join("\n")}
          required
        />
      </label>
      <label className="admin-check">
        <input name="featured" type="checkbox" defaultChecked={plan?.featured} />
        Featured plan
      </label>
      <label>
        Sort order
        <input name="sortOrder" type="number" defaultValue={0} />
      </label>
      <button type="submit" className="primary-btn">
        {plan ? "Save plan" : "Add plan"}
      </button>
    </form>
  );
}
