"use client";

import { type ChangeEvent, useState } from "react";
import { saveGalleryBatch } from "@/lib/admin-actions";
import type { SubcategoryRecord } from "@/lib/content";

type GalleryItem = {
  url: string;
  title: string;
};

async function uploadOne(file: File): Promise<GalleryItem> {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body,
  });

  let data: { items?: GalleryItem[]; error?: string } = {};
  try {
    data = (await response.json()) as typeof data;
  } catch {
    throw new Error(
      response.ok
        ? "Upload returned an invalid response."
        : `Upload failed (${response.status}).`,
    );
  }

  if (!response.ok || !data.items?.[0]) {
    throw new Error(data.error || "Upload failed.");
  }

  return data.items[0];
}

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
  const [uploading, setUploading] = useState(false);

  async function onFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploaded: GalleryItem[] = [];

    try {
      for (let index = 0; index < files.length; index += 1) {
        setStatus(`Uploading ${index + 1} of ${files.length}…`);
        uploaded.push(await uploadOne(files[index]!));
      }

      setItems((current) => [...current, ...uploaded]);
      setStatus(
        `${uploaded.length} ${uploaded.length === 1 ? "image" : "images"} ready.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Upload failed.";
      if (uploaded.length > 0) {
        setItems((current) => [...current, ...uploaded]);
        setStatus(
          `${uploaded.length} uploaded, then failed: ${message}`,
        );
      } else {
        setStatus(message);
      }
    } finally {
      setUploading(false);
      event.target.value = "";
    }
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
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={onFiles}
        />
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
                disabled={uploading}
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
        disabled={items.length === 0 || uploading}
      >
        {items.length === 0
          ? "Add gallery images"
          : `Add ${items.length} gallery ${items.length === 1 ? "image" : "images"}`}
      </button>
    </form>
  );
}
