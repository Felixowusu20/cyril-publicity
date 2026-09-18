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

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("Uploading…");
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body,
    });
    const data = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !data.url) {
      setStatus(data.error || "Upload failed.");
      return;
    }
    setValue(data.url);
    setStatus("Image uploaded.");
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
      <input type="file" accept="image/*" onChange={onFile} />
      {status ? <small>{status}</small> : null}
    </label>
  );
}
