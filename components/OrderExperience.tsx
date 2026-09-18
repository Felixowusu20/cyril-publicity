"use client";

import { FormEvent, Suspense, useState } from "react";
import { OrderForm } from "@/components/OrderForm";
import { OrderTracker } from "@/components/OrderTracker";
import { findOrder } from "@/lib/orders";
import type { Service } from "@/lib/data";

export function OrderExperience({
  services,
  siteName,
  whatsapp,
}: {
  services: Pick<Service, "slug" | "title">[];
  siteName: string;
  whatsapp: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [lookup, setLookup] = useState("");
  const [lookupMessage, setLookupMessage] = useState("");

  function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = findOrder(lookup);
    if (!found) {
      setLookupMessage("No local order found for that code yet.");
      return;
    }
    setOrderId(found.id);
    setCurrentStep(found.status);
    setLookupMessage(`Showing ${found.service} for ${found.name}.`);
  }

  return (
    <div className="order-layout">
      <div>
        <OrderTracker currentStep={currentStep} orderId={orderId || undefined} />
        <form className="track-lookup" onSubmit={handleLookup}>
          <input
            value={lookup}
            onChange={(event) => setLookup(event.target.value)}
            placeholder="Enter order code, e.g. CP-4821"
            aria-label="Order code"
          />
          <button type="submit" className="secondary-btn">
            Track
          </button>
        </form>
        {lookupMessage ? <p className="form-status">{lookupMessage}</p> : null}
      </div>
      <div className="order-box">
        <h2>Submit Your Design Request</h2>
        <p>
          Fill in the form and we will open WhatsApp with your brief and a
          tracking code.
        </p>
        <Suspense fallback={<p>Loading order form…</p>}>
          <OrderForm
            services={services}
            siteName={siteName}
            whatsapp={whatsapp}
            onCreated={(order) => {
              setOrderId(order.id);
              setCurrentStep(order.status);
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
