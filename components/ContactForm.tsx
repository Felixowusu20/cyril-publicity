"use client";

import { FormEvent, useState } from "react";
import { site, whatsappUrl } from "@/lib/site";

export function ContactForm({
  siteName = site.name,
  whatsapp = site.whatsapp,
}: {
  siteName?: string;
  whatsapp?: string;
}) {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const text = [
      `Hello ${siteName}, I would like to get in touch.`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Message: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");

    setStatus("Opening WhatsApp with your message…");
    window.open(whatsappUrl(text, whatsapp), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Full name
          <input name="name" type="text" required autoComplete="name" />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" required autoComplete="tel" />
        </label>
      </div>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" placeholder="Optional" />
      </label>
      <label>
        Message
        <textarea
          name="message"
          required
          placeholder="Tell us about your project, event or question."
        />
      </label>
      <button type="submit" className="primary-btn">
        Send on WhatsApp
      </button>
      {status ? <p className="form-status">{status}</p> : null}
    </form>
  );
}
