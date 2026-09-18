import { saveProcessStep } from "@/lib/admin-actions";
import type { ProcessRecord } from "@/lib/content";

export function ProcessForm({ step }: { step?: ProcessRecord }) {
  return (
    <form action={saveProcessStep} className="admin-form">
      {step ? <input type="hidden" name="id" value={step.id} /> : null}
      <label>
        Step number
        <input name="step" defaultValue={step?.step} placeholder="01" required />
      </label>
      <label>
        Title
        <input name="title" defaultValue={step?.title} required />
      </label>
      <label>
        Description
        <textarea name="body" defaultValue={step?.body} required />
      </label>
      <label>
        Sort order
        <input name="sortOrder" type="number" defaultValue={0} />
      </label>
      <button type="submit" className="primary-btn">
        {step ? "Save step" : "Add step"}
      </button>
    </form>
  );
}
