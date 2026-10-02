import fs from "fs";
import path from "path";
import sharp from "sharp";

export interface OptimizedImageResult {
  originalUrl: string;
  webpUrl: string;
  avifUrl?: string;
  thumbnailUrl: string; // 150px
  smallUrl: string;     // 400px
  mediumUrl: string;    // 800px
  largeUrl: string;     // 1200px
  width: number;
  height: number;
  size: number;
  format: string;
}

export async function processAndOptimizeImage(
  buffer: Buffer,
  filename: string
): Promise<OptimizedImageResult> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const timestamp = Date.now();
  const filePrefix = `${baseName}_${timestamp}`;

  // Read metadata
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const width = metadata.width || 800;
  const height = metadata.height || 600;

  // 1. Save compressed original
  const originalFileName = `${filePrefix}${ext || ".jpg"}`;
  const originalFilePath = path.join(uploadsDir, originalFileName);
  fs.writeFileSync(originalFilePath, buffer);
  const originalUrl = `/uploads/${originalFileName}`;

  // 2. Generate WebP version (Universal modern format)
  const webpFileName = `${filePrefix}.webp`;
  const webpFilePath = path.join(uploadsDir, webpFileName);
  await sharp(buffer)
    .webp({ quality: 80 })
    .toFile(webpFilePath);
  const webpUrl = `/uploads/${webpFileName}`;

  // 3. Generate AVIF version (Next-gen ultra compression)
  let avifUrl: string | undefined = undefined;
  try {
    const avifFileName = `${filePrefix}.avif`;
    const avifFilePath = path.join(uploadsDir, avifFileName);
    await sharp(buffer)
      .avif({ quality: 75 })
      .toFile(avifFilePath);
    avifUrl = `/uploads/${avifFileName}`;
  } catch (e) {
    // If system doesn't support avif encoding, webp serves as primary modern fallback
    avifUrl = webpUrl;
  }

  // 4. Generate Responsive Sizes in WebP:
  // Thumbnail (150px)
  const thumbFileName = `${filePrefix}_thumb.webp`;
  await sharp(buffer)
    .resize(150, 150, { fit: "cover" })
    .webp({ quality: 75 })
    .toFile(path.join(uploadsDir, thumbFileName));
  const thumbnailUrl = `/uploads/${thumbFileName}`;

  // Small (400px)
  const smallFileName = `${filePrefix}_400.webp`;
  await sharp(buffer)
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(uploadsDir, smallFileName));
  const smallUrl = `/uploads/${smallFileName}`;

  // Medium (800px)
  const medFileName = `${filePrefix}_800.webp`;
  await sharp(buffer)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(uploadsDir, medFileName));
  const mediumUrl = `/uploads/${medFileName}`;

  // Large (1200px)
  const lrgFileName = `${filePrefix}_1200.webp`;
  await sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(uploadsDir, lrgFileName));
  const largeUrl = `/uploads/${lrgFileName}`;

  return {
    originalUrl,
    webpUrl,
    avifUrl,
    thumbnailUrl,
    smallUrl,
    mediumUrl,
    largeUrl,
    width,
    height,
    size: buffer.length,
    format: metadata.format || "jpeg",
  };
}
