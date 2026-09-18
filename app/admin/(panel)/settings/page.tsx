import { AccountForm } from "@/components/admin/AccountForm";
import { getCurrentAdmin } from "@/lib/auth";
import { saveBrand } from "@/lib/admin-actions";
import { getSettings } from "@/lib/content";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  const [admin, settings] = await Promise.all([getCurrentAdmin(), getSettings()]);
  if (!admin) redirect("/admin/login");

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">One admin account</p>
          <h1>Settings</h1>
        </div>
      </div>

      <section className="admin-preview-block">
        <div className="admin-preview-bar">
          <strong>Site identity</strong>
        </div>
        <form action={saveBrand} className="admin-form admin-form-grid">
          <label>
            Studio name
            <input name="name" defaultValue={settings.name} required />
          </label>
          <label>
            Tagline
            <input name="tagline" defaultValue={settings.tagline} required />
          </label>
          <label className="admin-span-2">
            SEO description
            <textarea name="description" defaultValue={settings.description} />
          </label>
          <label>
            Website URL
            <input name="url" defaultValue={settings.url} />
          </label>
          <label>
            Location
            <input name="location" defaultValue={settings.location} />
          </label>
          <label>
            Phone display
            <input name="phoneDisplay" defaultValue={settings.phoneDisplay} />
          </label>
          <label>
            Phone international
            <input name="phoneIntl" defaultValue={settings.phoneIntl} />
          </label>
          <label>
            WhatsApp number
            <input name="whatsapp" defaultValue={settings.whatsapp} />
          </label>
          <button type="submit" className="primary-btn">
            Save identity
          </button>
        </form>
      </section>

      <section className="admin-preview-block">
        <div className="admin-preview-bar">
          <strong>Admin login</strong>
        </div>
        <p>
          There is only one admin. Change the email and password here after the
          first seed.
        </p>
        <AccountForm email={admin.email} />
      </section>
    </>
  );
}
