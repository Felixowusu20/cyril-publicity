"use client";

import { useEffect, useState } from "react";
import { CoverImage } from "@/components/CoverImage";
import type { PortfolioItem } from "@/lib/data";

type GalleryItem = PortfolioItem & {
  subcategoryName?: string | null;
};

export function DesignGallery({
  items,
  emptyMessage = "Designs for this category will appear here soon.",
}: {
  items: GalleryItem[];
  emptyMessage?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? current : (current + 1) % items.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? current : (current - 1 + items.length) % items.length,
        );
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, items.length]);

  if (items.length === 0) {
    return <p className="gallery-empty">{emptyMessage}</p>;
  }

  return (
    <>
      <div className="portfolio-grid">
        {items.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            className="portfolio-item"
            onClick={() => setActiveIndex(index)}
          >
            <CoverImage src={item.image} alt={item.alt} />
            <div className="portfolio-caption">
              {item.title}
              <span>View fullscreen</span>
            </div>
          </button>
        ))}
      </div>

      {activeItem ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label="Close fullscreen view"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex(null);
            }}
          >
            Close
          </button>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                className="lightbox-nav lightbox-prev"
                aria-label="Previous design"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((current) =>
                    current === null ? current : (current - 1 + items.length) % items.length,
                  );
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className="lightbox-nav lightbox-next"
                aria-label="Next design"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((current) =>
                    current === null ? current : (current + 1) % items.length,
                  );
                }}
              >
                ›
              </button>
            </>
          ) : null}

          <div className="lightbox-stage" onClick={(event) => event.stopPropagation()}>
            <div className="lightbox-image">
                <CoverImage src={activeItem.image} alt={activeItem.alt} priority />
            </div>
            <p className="lightbox-caption">
              {activeItem.title}
              <span>
                {activeItem.subcategoryName
                  ? `${activeItem.category} · ${activeItem.subcategoryName}`
                  : activeItem.category}
              </span>
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
