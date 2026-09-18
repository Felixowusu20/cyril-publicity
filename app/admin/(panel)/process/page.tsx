import Link from "next/link";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { deleteProcessStep } from "@/lib/admin-actions";
import { getProcessSteps } from "@/lib/content";

export default async function AdminProcessPage() {
  const steps = await getProcessSteps();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Mirrors How it works</p>
          <h1>Process</h1>
        </div>
        <Link href="/admin/process/new" className="primary-btn">
          Add step
        </Link>
      </div>
      <div className="process-grid">
        {steps.map((item) => (
          <article key={item.id} className="admin-item-card">
            <span>{item.step}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <div className="admin-item-actions">
              <Link href={`/admin/process/${item.id}`} className="secondary-btn">
                Edit
              </Link>
              <ConfirmDelete
                name={item.title}
                label="process step"
                action={deleteProcessStep}
                hiddenFields={{ id: item.id }}
              />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
