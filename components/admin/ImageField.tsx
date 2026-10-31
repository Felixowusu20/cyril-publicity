"use client";

import { type ChangeEvent, useState } from "react";

type ImageFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
};

export function ImageField({ name, label, defaultValue = "" }: ImageFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus("Uploading…");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });

      let data: { url?: string; error?: string } = {};
      try {
        data = (await response.json()) as typeof data;
      } catch {
        throw new Error(
          response.ok
            ? "Upload returned an invalid response."
            : `Upload failed (${response.status}).`,
        );
      }

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Upload failed.");
      }

      setValue(data.url);
      setStatus("Image uploaded.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <label className="admin-image-field">
      {label}
      <input type="hidden" name={name} value={value} />
      {value ? (
        <span
          className="admin-image-preview"
          style={{ backgroundImage: `url('${value}')` }}
        />
      ) : null}
      <input
        type="url"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="/images/example.png or https://…"
      />
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={onFile}
      />
      {status ? <small>{status}</small> : null}
    </label>
  );
}
