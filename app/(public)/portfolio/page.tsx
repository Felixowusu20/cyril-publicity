import type { Metadata } from "next";
import { Cta } from "@/components/Cta";
import { DesignGallery } from "@/components/DesignGallery";
import { PageHeader } from "@/components/PageHeader";
import { getDesigns, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore selected graphic design work from CyrilPublicity.",
};

export default async function PortfolioPage() {
  const [settings, designs] = await Promise.all([getSettings(), getDesigns()]);

  return (
    <>
      <PageHeader
        eyebrow={settings.portfolioEyebrow}
        title="Portfolio"
        description={settings.portfolioDescription}
      />
      <section className="section">
        <DesignGallery items={designs} />
      </section>
      <Cta title="Need a Design?" label={settings.ctaLabel} />
    </>
  );
}
