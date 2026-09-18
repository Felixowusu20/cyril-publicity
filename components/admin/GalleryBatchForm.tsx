"use client";

import { type ChangeEvent, useState } from "react";
import { saveGalleryBatch } from "@/lib/admin-actions";
import type { SubcategoryRecord } from "@/lib/content";

type GalleryItem = {
  url: string;
  title: string;
};

export function GalleryBatchForm({
  serviceId,
  subcategories = [],
  returnTo,
}: {
  serviceId: string;
  subcategories?: SubcategoryRecord[];
  returnTo: string;
}) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [status, setStatus] = useState("");

  async function onFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setStatus(`Uploading ${files.length} ${files.length === 1 ? "image" : "images"}…`);
    const body = new FormData();
    files.forEach((file) => body.append("file", file));
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body,
    });
    const data = (await response.json()) as {
      items?: GalleryItem[];
      error?: string;
    };
    if (!response.ok || !data.items?.length) {
      setStatus(data.error || "Upload failed.");
      return;
    }

    setItems((current) => [...current, ...data.items!]);
    setStatus(`${data.items.length} ${data.items.length === 1 ? "image" : "images"} ready.`);
    event.target.value = "";
  }

  function updateTitle(index: number, title: string) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, title } : item,
      ),
    );
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <form action={saveGalleryBatch} className="admin-form">
      <input type="hidden" name="serviceId" value={serviceId} />
      <input type="hidden" name="returnTo" value={returnTo} />
      {subcategories.length > 0 ? (
        <label>
          Subcategory for this batch
          <select name="subcategoryId" defaultValue="">
            <option value="">All of this category</option>
            {subcategories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="gallery-empty">
          These images will show for the whole category. Add subcategory chips
          first if you want to group them.
        </p>
      )}
      <label className="admin-image-field">
        Choose several images
        <input type="file" accept="image/*" multiple onChange={onFiles} />
        {status ? <small>{status}</small> : null}
      </label>
      {items.length > 0 ? (
        <div className="admin-batch-grid">
          {items.map((item, index) => (
            <article key={`${item.url}-${index}`} className="admin-batch-card">
              <input type="hidden" name="images" value={item.url} />
              <div
                className="admin-thumb"
                style={{ backgroundImage: `url('${item.url}')` }}
              />
              <input
                name="titles"
                value={item.title}
                onChange={(event) => updateTitle(index, event.target.value)}
                aria-label={`Title for image ${index + 1}`}
              />
              <button
                type="button"
                className="admin-text-btn"
                onClick={() => removeItem(index)}
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p className="gallery-empty">
          Select multiple images at once. They will all be added to this
          gallery in one save.
        </p>
      )}
      <button
        type="submit"
        className="primary-btn"
        disabled={items.length === 0}
      >
        {items.length === 0
          ? "Add gallery images"
          : `Add ${items.length} gallery ${items.length === 1 ? "image" : "images"}`}
      </button>
    </form>
  );
}
