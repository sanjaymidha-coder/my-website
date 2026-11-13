// src/js/optimize-images.js
import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./assets/images/work"; // your original images
const outputDir = "./assets/images/optimized"; // optimized output folder

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = [380, 760, 1140]; // responsive sizes (px)

// Loop through all files in the input directory
fs.readdirSync(inputDir).forEach(async (file) => {
  // Only process image files
  if (!/\.(webp|jpg|jpeg|png)$/i.test(file)) return;

  const inputPath = path.join(inputDir, file);
  const baseName = path.parse(file).name;

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `${baseName}-${size}.webp`);
    try {
      await sharp(inputPath)
        .resize({ width: size })
        .webp({ quality: 75 })
        .toFile(outputPath);
      console.log(`✅ Created ${outputPath}`);
    } catch (err) {
      console.error(`❌ Error optimizing ${file} (${size}px):`, err);
    }
  }
});
