import { CoverImage } from "@/components/CoverImage";
import type { PortfolioItem } from "@/lib/data";

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="portfolio-grid">
      {items.map((item) => (
        <article key={item.slug} className="portfolio-item">
          <CoverImage src={item.image} alt={item.alt} />
          <div className="portfolio-caption">
            {item.title}
            <span>{item.category}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
