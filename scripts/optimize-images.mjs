// Converts heavy raster/SVG assets to WebP. Run: npm run optimize:images
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const IMG = "public/assets/images";
const jobs = [
  // [source, output, options]
  ["hero-img.svg", "hero-img.webp", { width: 1920, density: 192 }],
  ["footer-bg.jpg", "footer-bg.webp", { width: 1920 }],
  ["design-growth/faster-product-delivery.jpg", "design-growth/faster-product-delivery.webp", { width: 1200 }],
  ["design-growth/higher-conversion.jpg", "design-growth/higher-conversion.webp", { width: 1200 }],
  ...[1, 2, 3, 4, 5].map((n) => [`partnerships/frame-${n}.jpg`, `partnerships/frame-${n}.webp`, { width: 900 }]),
];

for (const [src, out, { width, density }] of jobs) {
  const from = path.join(IMG, src);
  try {
    await fs.access(from);
  } catch {
    console.log("skip (missing)", src);
    continue;
  }
  const before = (await fs.stat(from)).size;
  await sharp(from, density ? { density } : undefined)
    .resize({ width, withoutEnlargement: !density })
    .webp({ quality: 78 })
    .toFile(path.join(IMG, out));
  const after = (await fs.stat(path.join(IMG, out))).size;
  console.log(`${src} ${(before / 1024).toFixed(0)}KB -> ${out} ${(after / 1024).toFixed(0)}KB`);
}
