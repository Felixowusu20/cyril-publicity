import { orderSteps } from "@/lib/orders";

type OrderTrackerProps = {
  currentStep: number;
  orderId?: string;
};

export function OrderTracker({ currentStep, orderId }: OrderTrackerProps) {
  return (
    <aside className="order-tracker">
      <p className="small-title">ORDER TRACKING</p>
      <h2>Follow your design</h2>
      <p>
        After you send the brief, use your order code to see where the work is.
      </p>
      <div className="track-steps">
        {orderSteps.map((step, index) => {
          const state =
            index < currentStep ? "done" : index === currentStep ? "current" : "";
          return (
            <div key={step.title} className={`track-step ${state}`.trim()}>
              <span className="track-dot" aria-hidden="true">
                {index < currentStep ? "✓" : index + 1}
              </span>
              <div className="track-copy">
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </div>
            </div>
          );
        })}
      </div>
      {orderId ? (
        <p className="track-code">
          Your order code: <strong>{orderId}</strong>
        </p>
      ) : null}
    </aside>
  );
}
