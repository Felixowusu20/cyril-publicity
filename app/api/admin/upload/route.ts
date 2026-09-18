import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

function isImageFile(value: FormDataEntryValue): value is File {
  return value instanceof File && value.size > 0 && value.type.startsWith("image/");
}

async function saveImage(file: File) {
  const extension = path.extname(file.name) || ".png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(directory, filename), buffer);
  return { url: `/uploads/${filename}`, title: file.name.replace(/\.[^.]+$/, "") };
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const files = form.getAll("file").filter(isImageFile);
  if (files.length === 0) {
    return NextResponse.json({ error: "Choose images to upload." }, { status: 400 });
  }

  const items = await Promise.all(files.map(saveImage));
  return NextResponse.json({
    url: items[0]?.url,
    urls: items.map((item) => item.url),
    items,
  });
}
