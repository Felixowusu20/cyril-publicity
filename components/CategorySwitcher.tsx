import Link from "next/link";
import type { Service } from "@/lib/data";
import type { SubcategoryRecord } from "@/lib/content";

type CategorySwitcherProps = {
  activeSlug: string;
  services: Pick<Service, "slug" | "title">[];
  subcategories?: SubcategoryRecord[];
  activeSubSlug?: string;
};

export function CategorySwitcher({
  activeSlug,
  services,
  subcategories = [],
  activeSubSlug,
}: CategorySwitcherProps) {
  return (
    <div className="category-switcher-stack">
      <nav className="category-switcher" aria-label="Design categories">
        {services.map((item) => {
          const active = item.slug === activeSlug;

          return (
            <Link
              key={item.slug}
              href={`/services/${item.slug}`}
              className={`category-chip${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
      {subcategories.length > 0 ? (
        <nav className="category-switcher subcategory-switcher" aria-label="Subcategories">
          <Link
            href={`/services/${activeSlug}`}
            className={`category-chip${!activeSubSlug ? " active" : ""}`}
            aria-current={!activeSubSlug ? "page" : undefined}
          >
            All
          </Link>
          {subcategories.map((item) => {
            const active = item.slug === activeSubSlug;
            return (
              <Link
                key={item.id}
                href={`/services/${activeSlug}?sub=${item.slug}`}
                className={`category-chip${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
