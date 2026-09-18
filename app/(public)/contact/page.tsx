import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Cta } from "@/components/Cta";
import { PageHeader } from "@/components/PageHeader";
import { getSettings } from "@/lib/content";
import { whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with CyrilPublicity to discuss your next design project.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const enquiryMessage = `Hello ${settings.name}, I would like to enquire about a design.`;
  return (
    <>
      <PageHeader
        eyebrow={settings.contactEyebrow}
        title={settings.contactTitle}
        description={settings.contactDescription}
        compact
      />

      <section className="section contact-page">
        <div className="contact-layout">
          <div className="contact-methods">
            <a
              className="contact-card featured"
              href={whatsappUrl(enquiryMessage, settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-icon whatsapp" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path
                    fill="currentColor"
                    d="M20.5 3.5A11 11 0 0 0 2.1 17.8L1 23l5.3-1.1A11 11 0 1 0 20.5 3.5zm-8.5 18a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.2.7.7-3.1-.2-.3A9.1 9.1 0 1 1 12 21.5zm5.3-6.8c-.3-.1-1.7-.8-2-.9s-.5-.2-.7.1-.8.9-1 1.1-.4.2-.7.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.5-.6c.1-.2.1-.3 0-.5l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3 .2.3 2 3.2a13.7 13.7 0 0 0 5.3 3.1c.7.2 1.3.2 1.8.1s1.7-.7 1.9-1.4.2-1.3.2-1.4-.2-.2-.5-.3z"
                  />
                </svg>
              </span>
              <span>
                <strong>WhatsApp</strong>
                <span className="contact-value">{settings.phoneDisplay}</span>
                <span className="contact-hint">Fastest reply · chat now</span>
              </span>
            </a>

            <a className="contact-card" href={`tel:${settings.phoneIntl}`}>
              <span className="contact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6.5 3.8h3.2l1.3 3.3-2 1.2a12 12 0 0 0 6.7 6.7l1.2-2 3.3 1.3v3.2c0 .9-.7 1.7-1.6 1.8C9.4 20.3 3.7 14.6 2.7 5.4c-.1-.9.7-1.6 1.8-1.6Z" />
                </svg>
              </span>
              <span>
                <strong>Phone</strong>
                <span className="contact-value">{settings.phoneDisplay}</span>
                <span className="contact-hint">Call for a quick brief</span>
              </span>
            </a>

            <div className="contact-card">
              <span className="contact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.4" />
                </svg>
              </span>
              <span>
                <strong>Location</strong>
                <span className="contact-value">{settings.location}</span>
                <span className="contact-hint">Serving clients nationwide</span>
              </span>
            </div>

            <div className="contact-card">
              <span className="contact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="8.2" />
                  <path d="M12 7.5V12l3 2" />
                </svg>
              </span>
              <span>
                <strong>Response time</strong>
                <span className="contact-value">{settings.contactResponse}</span>
                <span className="contact-hint">Most messages get a reply within a few hours</span>
              </span>
            </div>
          </div>

          <div className="contact-panel">
            <p className="small-title">SEND A MESSAGE</p>
            <h2>Tell us what you need</h2>
            <p>
              Share a short brief and we will open WhatsApp with your message
              ready to send.
            </p>
            <ContactForm siteName={settings.name} whatsapp={settings.whatsapp} />
            <p className="contact-panel-note">
              Already know the service you want?{" "}
              <Link href="/order">Start an order</Link>
            </p>
          </div>
        </div>
      </section>

      <Cta
        title="Ready to start a project?"
        body="Send a design request and we will take it from there."
        label="Order a Design"
      />
    </>
  );
}
