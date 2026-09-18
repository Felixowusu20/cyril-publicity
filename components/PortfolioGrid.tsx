import Image from "next/image";
import type { PortfolioItem } from "@/lib/data";

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="portfolio-grid">
      {items.map((item) => (
        <article key={item.slug} className="portfolio-item">
          <Image src={item.image} alt={item.alt} fill sizes="(max-width: 768px) 100vw, 33vw" />
          <div className="portfolio-caption">
            {item.title}
            <span>{item.category}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
