import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategorySwitcher } from "@/components/CategorySwitcher";
import { DesignGallery } from "@/components/DesignGallery";
import {
  getDesignsForService,
  getServiceBySlug,
  getServices,
  getSubcategories,
} from "@/lib/content";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
};

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: "Service" };
  }

  return {
    title: service.title,
    description: service.details,
  };
}

export default async function ServiceCategoryPage({
  params,
  searchParams,
}: ServicePageProps) {
  const { slug } = await params;
  const { sub } = await searchParams;
  const [service, services] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
  ]);

  if (!service) {
    notFound();
  }

  const [designs, subcategories] = await Promise.all([
    getDesignsForService(service.slug, sub),
    getSubcategories(service.id),
  ]);

  return (
    <section className="section category-gallery">
      <h1 className="sr-only">{service.title}</h1>
      <CategorySwitcher
        activeSlug={service.slug}
        services={services}
        subcategories={subcategories}
        activeSubSlug={sub}
      />
      <DesignGallery
        items={designs}
        emptyMessage={
          sub
            ? "No designs in this subcategory yet."
            : "Designs for this category will appear here soon."
        }
      />
      <div className="center-button">
        <Link href={`/order?service=${service.slug}`} className="primary-btn">
          Order {service.title}
        </Link>
      </div>
    </section>
  );
}
