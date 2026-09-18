import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getPricePlans, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent graphic design packages from CyrilPublicity. Final pricing depends on your brief.",
};

export default async function PricingPage() {
  const [settings, plans] = await Promise.all([getSettings(), getPricePlans()]);

  return (
    <>
      <PageHeader
        eyebrow={settings.pricingEyebrow}
        title={settings.pricingTitle}
        description={settings.pricingDescription}
      />
      <section className="section">
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article
              key={plan.slug}
              className={`price-card${plan.featured ? " featured" : ""}`}
            >
              <h3>{plan.title}</h3>
              <h4>Quote on request</h4>
              <p>{plan.summary}</p>
              <ul>
                {plan.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href={`/order?service=${plan.slug}`} className="primary-btn">
                Order Now
              </Link>
            </article>
          ))}
        </div>
        <div className="pricing-note">
          <p>{settings.pricingNote}</p>
        </div>
      </section>
    </>
  );
}
