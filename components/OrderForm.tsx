"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createOrder } from "@/lib/orders";
import { site, whatsappUrl } from "@/lib/site";
import type { Service } from "@/lib/data";

const fieldIcon = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
} as const;

type OrderFormProps = {
  onCreated: (order: { id: string; status: number }) => void;
  services: Pick<Service, "slug" | "title">[];
  siteName?: string;
  whatsapp?: string;
};

export function OrderForm({
  onCreated,
  services,
  siteName = site.name,
  whatsapp = site.whatsapp,
}: OrderFormProps) {
  const searchParams = useSearchParams();
  const requestedService = searchParams.get("service");
  const selectedService =
    services.find((service) => service.slug === requestedService)?.title ?? "";
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const service = String(data.get("service") || "").trim();
    const details = String(data.get("details") || "").trim();

    const order = createOrder({ name, service });
    onCreated(order);

    const message = [
      `Hello ${siteName}, I would like to order a design.`,
      `Order code: ${order.id}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Service: ${service}`,
      `Details: ${details}`,
    ]
      .filter(Boolean)
      .join("\n");

    setStatus(`Order ${order.id} created. Opening WhatsApp…`);
    window.open(whatsappUrl(message, whatsapp), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <label>
        <span className="field-label">
          <svg {...fieldIcon}>
            <circle cx="12" cy="8" r="3.2" />
            <path d="M5.5 19c1.4-3 4-4.5 6.5-4.5S16.1 16 17.5 19" />
          </svg>
          Full name
        </span>
        <span className="input-with-icon">
          <svg {...fieldIcon}>
            <circle cx="12" cy="8" r="3.2" />
            <path d="M5.5 19c1.4-3 4-4.5 6.5-4.5S16.1 16 17.5 19" />
          </svg>
          <input name="name" type="text" required autoComplete="name" />
        </span>
      </label>
      <label>
        <span className="field-label">
          <svg {...fieldIcon}>
            <path d="M6.5 3.8h3.2l1.3 3.3-2 1.2a12 12 0 0 0 6.7 6.7l1.2-2 3.3 1.3v3.2c0 .9-.7 1.7-1.6 1.8C9.4 20.3 3.7 14.6 2.7 5.4c-.1-.9.7-1.6 1.8-1.6Z" />
          </svg>
          Phone
        </span>
        <span className="input-with-icon">
          <svg {...fieldIcon}>
            <path d="M6.5 3.8h3.2l1.3 3.3-2 1.2a12 12 0 0 0 6.7 6.7l1.2-2 3.3 1.3v3.2c0 .9-.7 1.7-1.6 1.8C9.4 20.3 3.7 14.6 2.7 5.4c-.1-.9.7-1.6 1.8-1.6Z" />
          </svg>
          <input name="phone" type="tel" required autoComplete="tel" />
        </span>
      </label>
      <label>
        <span className="field-label">
          <svg {...fieldIcon}>
            <rect x="4" y="6" width="16" height="12" rx="2" />
            <path d="m5 8 7 5 7-5" />
          </svg>
          Email
        </span>
        <span className="input-with-icon">
          <svg {...fieldIcon}>
            <rect x="4" y="6" width="16" height="12" rx="2" />
            <path d="m5 8 7 5 7-5" />
          </svg>
          <input name="email" type="email" autoComplete="email" />
        </span>
      </label>
      <label>
        <span className="field-label">
          <svg {...fieldIcon}>
            <path d="M4 7h7l2 2h7v10H4V7Z" />
          </svg>
          Service
        </span>
        <span className="input-with-icon">
          <svg {...fieldIcon}>
            <path d="M4 7h7l2 2h7v10H4V7Z" />
          </svg>
          <select name="service" required defaultValue={selectedService}>
            <option value="" disabled>
              Select a service
            </option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </span>
      </label>
      <label>
        <span className="field-label">
          <svg {...fieldIcon}>
            <path d="M5 6h14M5 12h10M5 18h7" />
          </svg>
          Project details
        </span>
        <textarea
          name="details"
          required
          placeholder="What do you need, any deadline, and references?"
        />
      </label>
      <button type="submit" className="primary-btn">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.5 3.5A11 11 0 0 0 2.1 17.8L1 23l5.3-1.1A11 11 0 1 0 20.5 3.5zm-8.5 18a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.2.7.7-3.1-.2-.3A9.1 9.1 0 1 1 12 21.5z"
          />
        </svg>
        Send on WhatsApp
      </button>
      {status ? <p className="form-status">{status}</p> : null}
    </form>
  );
}
