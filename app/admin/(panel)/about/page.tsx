import { saveAbout } from "@/lib/admin-actions";
import { getSettings } from "@/lib/content";

export default async function AdminAboutPage() {
  const settings = await getSettings();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Mirrors About</p>
          <h1>About</h1>
        </div>
      </div>
      <form action={saveAbout} className="admin-form">
        <label>
          Eyebrow
          <input name="aboutEyebrow" defaultValue={settings.aboutEyebrow} />
        </label>
        <label>
          Title
          <input name="aboutTitle" defaultValue={settings.aboutTitle} />
        </label>
        <label>
          Intro label
          <input name="aboutIntroTitle" defaultValue={settings.aboutIntroTitle} />
        </label>
        <label>
          About body
          <textarea name="aboutBody" rows={8} defaultValue={settings.aboutBody} />
        </label>
        <label>
          Mission
          <textarea name="aboutMission" defaultValue={settings.aboutMission} />
        </label>
        <label>
          Vision
          <textarea name="aboutVision" defaultValue={settings.aboutVision} />
        </label>
        <button type="submit" className="primary-btn">
          Save about page
        </button>
      </form>
    </>
  );
}
