export const site = {
  name: "CyrilPublicity",
  tagline: "Creative Designs. Powerful Impressions.",
  description:
    "Professional graphic design for businesses, events, organizations and individuals.",
  url: "https://cyrilpublicity.com",
  location: "Ghana",
  phoneDisplay: "059 637 5191",
  phoneIntl: "+233596375191",
  whatsapp: "233596375191",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappUrl(message?: string, number: string = site.whatsapp) {
  const base = `https://wa.me/${number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
