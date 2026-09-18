import Image from "next/image";
import Link from "next/link";
import { Cta } from "@/components/Cta";
import { DesignGallery } from "@/components/DesignGallery";
import { ServiceCard } from "@/components/ServiceCard";
import {
  getFeaturedDesigns,
  getProcessSteps,
  getServices,
  getSettings,
} from "@/lib/content";

export default async function HomePage() {
  const [settings, services, featured, steps] = await Promise.all([
    getSettings(),
    getServices(),
    getFeaturedDesigns(),
    getProcessSteps(),
  ]);

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="small-title hero-kicker">{settings.heroKicker}</p>
          <h1>
            {settings.heroTitle}
            <span>{settings.heroAccent}</span>
          </h1>
          <p className="hero-lead">{settings.heroLead}</p>
          <div className="hero-buttons">
            <Link href="/order" className="primary-btn">
              Order a Design
            </Link>
            <Link href="/portfolio" className="secondary-btn">
              View Portfolio
            </Link>
          </div>
        </div>

        <div className="cyril-image">
          <Image
            src={settings.heroImage}
            alt={settings.heroImageAlt}
            fill
            priority
            unoptimized={!settings.heroImage.startsWith("/")}
            sizes="(max-width: 768px) 48vw, 50vw"
          />
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <p>{settings.servicesEyebrow}</p>
          <h2>{settings.servicesTitle}</h2>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard
              key={service.slug}
              service={service}
              href={`/services/${service.slug}`}
            />
          ))}
        </div>
        <div className="center-button">
          <Link href="/services" className="secondary-btn">
            View All Services
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <p>{settings.portfolioEyebrow}</p>
          <h2>{settings.portfolioTitle}</h2>
        </div>
        <DesignGallery items={featured} />
        <div className="center-button">
          <Link href="/portfolio" className="primary-btn">
            View Full Portfolio
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <p>{settings.processEyebrow}</p>
          <h2>{settings.processTitle}</h2>
        </div>
        <div className="process-grid">
          {steps.map((item) => (
            <div key={item.id}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Cta title={settings.ctaTitle} body={settings.ctaBody} label={settings.ctaLabel} />
    </>
  );
}
