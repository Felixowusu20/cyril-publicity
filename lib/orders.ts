export const orderSteps = [
  {
    title: "Order sent",
    body: "Your brief is with us on WhatsApp.",
  },
  {
    title: "Confirmed",
    body: "We review the details and confirm the quote.",
  },
  {
    title: "Designing",
    body: "Your design is being created.",
  },
  {
    title: "Review",
    body: "Check the draft and request revisions.",
  },
  {
    title: "Delivered",
    body: "Final files are ready for you.",
  },
] as const;

export type SavedOrder = {
  id: string;
  name: string;
  service: string;
  status: number;
  createdAt: string;
};

const STORAGE_KEY = "cyril-orders";

function readOrders(): SavedOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedOrder[]) : [];
  } catch {
    return [];
  }
}

export function createOrder(input: { name: string; service: string }): SavedOrder {
  const order: SavedOrder = {
    id: `CP-${Math.floor(1000 + Math.random() * 9000)}`,
    name: input.name,
    service: input.service,
    status: 0,
    createdAt: new Date().toISOString(),
  };
  const next = [order, ...readOrders()].slice(0, 20);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return order;
}

export function findOrder(id: string) {
  const code = id.trim().toUpperCase();
  return readOrders().find((order) => order.id.toUpperCase() === code);
}
