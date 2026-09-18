import Link from "next/link";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { deletePricePlan, savePricingCopy } from "@/lib/admin-actions";
import { getPricePlans, getSettings } from "@/lib/content";

export default async function AdminPricingPage() {
  const [plans, settings] = await Promise.all([getPricePlans(), getSettings()]);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Mirrors Pricing</p>
          <h1>Pricing</h1>
        </div>
        <Link href="/admin/pricing/new" className="primary-btn">
          Add plan
        </Link>
      </div>

      <form action={savePricingCopy} className="admin-form admin-preview-block">
        <label>
          Eyebrow
          <input name="pricingEyebrow" defaultValue={settings.pricingEyebrow} />
        </label>
        <label>
          Title
          <input name="pricingTitle" defaultValue={settings.pricingTitle} />
        </label>
        <label>
          Description
          <textarea name="pricingDescription" defaultValue={settings.pricingDescription} />
        </label>
        <label>
          Footer note
          <textarea name="pricingNote" defaultValue={settings.pricingNote} />
        </label>
        <button type="submit" className="primary-btn">
          Save pricing copy
        </button>
      </form>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`price-card admin-item-card${plan.featured ? " featured" : ""}`}
          >
            <h3>{plan.title}</h3>
            <p>{plan.summary}</p>
            <ul>
              {plan.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="admin-item-actions">
              <Link href={`/admin/pricing/${plan.id}`} className="secondary-btn">
                Edit
              </Link>
              <ConfirmDelete
                name={plan.title}
                label="pricing plan"
                action={deletePricePlan}
                hiddenFields={{ id: plan.id }}
              />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
