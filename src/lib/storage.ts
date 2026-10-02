import { processAndOptimizeImage, OptimizedImageResult } from "./image-optimizer";

export interface UploadResult {
  url: string;
  name: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  webpUrl?: string;
  avifUrl?: string;
  thumbnailUrl?: string;
  smallUrl?: string;
  mediumUrl?: string;
  largeUrl?: string;
}

export async function saveUploadedFile(file: File): Promise<UploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const isImage = file.type.startsWith("image/");

  if (isImage) {
    try {
      const optimized: OptimizedImageResult = await processAndOptimizeImage(buffer, file.name);
      return {
        url: optimized.webpUrl, // Primary optimized URL served to web browsers
        name: file.name,
        size: optimized.size,
        mimeType: "image/webp",
        width: optimized.width,
        height: optimized.height,
        webpUrl: optimized.webpUrl,
        avifUrl: optimized.avifUrl,
        thumbnailUrl: optimized.thumbnailUrl,
        smallUrl: optimized.smallUrl,
        mediumUrl: optimized.mediumUrl,
        largeUrl: optimized.largeUrl,
      };
    } catch (err) {
      console.warn("Sharp image optimization failed, falling back to direct write:", err);
    }
  }

  // Fallback direct write for non-image or error
  const fs = await import("fs");
  const path = await import("path");
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const extension = path.extname(file.name) || ".jpg";
  const baseName = path.basename(file.name, extension).replace(/[^a-zA-Z0-9_-]/g, "_");
  const uniqueName = `${baseName}_${Date.now()}${extension}`;
  const filePath = path.join(uploadsDir, uniqueName);
  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/${uniqueName}`,
    name: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
  };
}
