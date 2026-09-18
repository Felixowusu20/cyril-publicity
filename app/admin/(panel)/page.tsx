import Link from "next/link";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { ImageField } from "@/components/admin/ImageField";
import { deleteDesign, deleteProcessStep, deleteService, saveCta, saveHero, saveHomeCopy } from "@/lib/admin-actions";
import {
  getDesigns,
  getProcessSteps,
  getServices,
  getSettings,
} from "@/lib/content";

export default async function AdminHomePage() {
  const [settings, services, designs, steps] = await Promise.all([
    getSettings(),
    getServices(),
    getDesigns(),
    getProcessSteps(),
  ]);
  const featured = designs.filter((item) => item.featured).slice(0, 6);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Mirrors the homepage</p>
          <h1>Home</h1>
        </div>
        <Link href="/" className="secondary-btn" target="_blank">
          Open live page
        </Link>
      </div>

      <section className="admin-preview-block">
        <div className="admin-preview-bar">
          <strong>Hero</strong>
        </div>
        <form action={saveHero} className="admin-form admin-form-grid">
          <label>
            Kicker
            <input name="heroKicker" defaultValue={settings.heroKicker} />
          </label>
          <label>
            Title
            <input name="heroTitle" defaultValue={settings.heroTitle} />
          </label>
          <label>
            Accent line
            <input name="heroAccent" defaultValue={settings.heroAccent} />
          </label>
          <label className="admin-span-2">
            Lead
            <textarea name="heroLead" defaultValue={settings.heroLead} />
          </label>
          <ImageField name="heroImage" label="Hero image" defaultValue={settings.heroImage} />
          <label>
            Image alt text
            <input name="heroImageAlt" defaultValue={settings.heroImageAlt} />
          </label>
          <button type="submit" className="primary-btn">
            Save hero
          </button>
        </form>
      </section>

      <section className="admin-preview-block">
        <div className="admin-preview-bar">
          <strong>Section titles</strong>
        </div>
        <form action={saveHomeCopy} className="admin-form admin-form-grid">
          <label>
            Services eyebrow
            <input name="servicesEyebrow" defaultValue={settings.servicesEyebrow} />
          </label>
          <label>
            Services title
            <input name="servicesTitle" defaultValue={settings.servicesTitle} />
          </label>
          <label>
            Portfolio eyebrow
            <input name="portfolioEyebrow" defaultValue={settings.portfolioEyebrow} />
          </label>
          <label>
            Portfolio title
            <input name="portfolioTitle" defaultValue={settings.portfolioTitle} />
          </label>
          <label>
            Process eyebrow
            <input name="processEyebrow" defaultValue={settings.processEyebrow} />
          </label>
          <label>
            Process title
            <input name="processTitle" defaultValue={settings.processTitle} />
          </label>
          <button type="submit" className="primary-btn">
            Save titles
          </button>
        </form>
      </section>

      <section className="admin-preview-block">
        <div className="admin-preview-bar">
          <strong>Services</strong>
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
              <div className="admin-item-actions">
                <Link href={`/admin/services/${service.id}`} className="secondary-btn">
                  Edit
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
      </section>

      <section className="admin-preview-block">
        <div className="admin-preview-bar">
          <strong>Featured portfolio</strong>
          <Link href="/admin/portfolio/new" className="primary-btn">
            Add design
          </Link>
        </div>
        <div className="admin-mini-grid">
          {(featured.length ? featured : designs.slice(0, 6)).map((item) => (
            <article key={item.id} className="admin-item-card">
              <div
                className="admin-thumb"
                style={{ backgroundImage: `url('${item.image}')` }}
              />
              <h3>{item.title}</h3>
              <p>{item.category}</p>
              <div className="admin-item-actions">
                <Link href={`/admin/portfolio/${item.id}`} className="secondary-btn">
                  Edit
                </Link>
                <ConfirmDelete
                  name={item.title}
                  label="design"
                  action={deleteDesign}
                  hiddenFields={{ id: item.id }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-preview-block">
        <div className="admin-preview-bar">
          <strong>How it works</strong>
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
                  label="step"
                  action={deleteProcessStep}
                  hiddenFields={{ id: item.id }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-preview-block">
        <div className="admin-preview-bar">
          <strong>Call to action</strong>
        </div>
        <form action={saveCta} className="admin-form">
          <label>
            Title
            <input name="ctaTitle" defaultValue={settings.ctaTitle} />
          </label>
          <label>
            Body
            <input name="ctaBody" defaultValue={settings.ctaBody} />
          </label>
          <label>
            Button label
            <input name="ctaLabel" defaultValue={settings.ctaLabel} />
          </label>
          <button type="submit" className="primary-btn">
            Save CTA
          </button>
        </form>
      </section>
    </>
  );
}
