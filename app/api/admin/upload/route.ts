import path from "node:path";
import { NextResponse } from "next/server";
import { getSessionAdminId } from "@/lib/auth";
import { uploadImageBuffer } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 12 * 1024 * 1024;
const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".bmp",
  ".svg",
  ".heic",
  ".heif",
]);

function looksLikeImage(file: File) {
  if (file.type.startsWith("image/")) return true;
  const extension = path.extname(file.name).toLowerCase();
  return IMAGE_EXTENSIONS.has(extension);
}

function isImageFile(value: FormDataEntryValue): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "name" in value &&
    "size" in value &&
    typeof (value as File).arrayBuffer === "function" &&
    Number((value as File).size) > 0 &&
    looksLikeImage(value as File)
  );
}

async function saveImage(file: File) {
  if (file.size > MAX_BYTES) {
    throw new Error(`“${file.name}” is larger than 12MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadImageBuffer(buffer, {
    filename: file.name,
    folder: "cyril-publicity",
  });

  return {
    url: uploaded.url,
    title: file.name.replace(/\.[^.]+$/, ""),
  };
}

export async function POST(request: Request) {
  try {
    // JWT-only check — avoid a Neon round-trip that can hang cold starts.
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await request.formData();
    const files = form.getAll("file").filter(isImageFile);
    if (files.length === 0) {
      return NextResponse.json(
        { error: "Choose images to upload." },
        { status: 400 },
      );
    }

    const items = [];
    for (const file of files) {
      items.push(await saveImage(file));
    }

    return NextResponse.json({
      url: items[0]?.url,
      urls: items.map((item) => item.url),
      items,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed.";
    console.error("[admin/upload]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
