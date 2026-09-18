import { saveContact } from "@/lib/admin-actions";
import { getSettings } from "@/lib/content";

export default async function AdminContactPage() {
  const settings = await getSettings();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Mirrors Contact</p>
          <h1>Contact</h1>
        </div>
      </div>
      <form action={saveContact} className="admin-form admin-form-grid">
        <label>
          Eyebrow
          <input name="contactEyebrow" defaultValue={settings.contactEyebrow} />
        </label>
        <label>
          Title
          <input name="contactTitle" defaultValue={settings.contactTitle} />
        </label>
        <label className="admin-span-2">
          Description
          <textarea name="contactDescription" defaultValue={settings.contactDescription} />
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
        <label>
          Location
          <input name="location" defaultValue={settings.location} />
        </label>
        <label className="admin-span-2">
          Response time
          <input name="contactResponse" defaultValue={settings.contactResponse} />
        </label>
        <button type="submit" className="primary-btn">
          Save contact page
        </button>
      </form>
    </>
  );
}
