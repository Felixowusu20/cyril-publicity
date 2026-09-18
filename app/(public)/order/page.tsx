import type { Metadata } from "next";
import { OrderExperience } from "@/components/OrderExperience";
import { PageHeader } from "@/components/PageHeader";
import { getServices, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Order a Design",
  description:
    "Submit a CyrilPublicity design request with your name, service and project details.",
};

export default async function OrderPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  return (
    <>
      <PageHeader
        eyebrow="START YOUR PROJECT"
        title="Order a Design"
        description="Tell us what you need, get a tracking code, and follow the design from brief to delivery."
        compact
      />
      <section className="section order-section">
        <OrderExperience
          services={services}
          siteName={settings.name}
          whatsapp={settings.whatsapp}
        />
      </section>
    </>
  );
}
