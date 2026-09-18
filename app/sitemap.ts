import type { MetadataRoute } from "next";
import { getServices, getSettings } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const routes = [
    "",
    "/services",
    "/portfolio",
    "/pricing",
    "/about",
    "/contact",
    "/order",
    ...services.map((service) => `/services/${service.slug}`),
  ];

  return routes.map((route) => ({
    url: `${settings.url}${route}`,
    lastModified: new Date(),
  }));
}
