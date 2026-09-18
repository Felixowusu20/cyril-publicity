import type { Metadata } from "next";
import { Cta } from "@/components/Cta";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { getServices, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Choose a CyrilPublicity design category to view sample work, then open any design in fullscreen.",
};

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  return (
    <>
      <PageHeader
        eyebrow={settings.servicesEyebrow}
        title="Services"
        description={settings.servicesDescription}
        compact
      />
      <section className="section">
        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard
              key={service.slug}
              service={service}
              href={`/services/${service.slug}`}
            />
          ))}
        </div>
      </section>
      <Cta
        title="Need one of these designs?"
        label={settings.ctaLabel}
      />
    </>
  );
}
