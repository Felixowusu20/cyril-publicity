import type { Metadata } from "next";
import { Cta } from "@/components/Cta";
import { PageHeader } from "@/components/PageHeader";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about CyrilPublicity and our approach to professional graphic design.",
};

export default async function AboutPage() {
  const settings = await getSettings();
  const paragraphs = settings.aboutBody.split(/\n+/).filter(Boolean);

  return (
    <>
      <PageHeader eyebrow={settings.aboutEyebrow} title={settings.aboutTitle} />
      <section className="section about-section">
        <div className="about-text">
          <p className="small-title">{settings.aboutIntroTitle}</p>
          <h2>{settings.tagline}</h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h3>Our Mission</h3>
          <p>{settings.aboutMission}</p>
          <h3>Our Vision</h3>
          <p>{settings.aboutVision}</p>
        </div>
      </section>
      <Cta title={settings.ctaTitle} body={settings.ctaBody} label={settings.ctaLabel} />
    </>
  );
}
