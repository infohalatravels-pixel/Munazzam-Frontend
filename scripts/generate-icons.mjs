import sharp from "sharp";
import toIco from "to-ico";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const source = path.join(rootDir, "public/icons/Munazzam-Logo.jpg");
const iconsDir = path.join(rootDir, "public/icons");
const publicDir = path.join(rootDir, "public");

const BRAND_COLOR = { r: 74, g: 16, b: 32 };

const iconSizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-48x48.png", size: 48 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

async function generateSquareIcon(size, outputPath, insetRatio = 0) {
  if (insetRatio === 0) {
    await sharp(source)
      .resize(size, size, { fit: "cover", position: "centre" })
      .png()
      .toFile(outputPath);
    return;
  }

  const inset = Math.round(size * insetRatio);
  const innerSize = size - inset * 2;

  const logo = await sharp(source)
    .resize(innerSize, innerSize, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: BRAND_COLOR,
    },
  })
    .composite([{ input: logo, gravity: "centre" }])
    .png()
    .toFile(outputPath);
}

async function generateOgImage() {
  const ogWidth = 1200;
  const ogHeight = 630;
  const logoHeight = 340;

  const logoBuffer = await sharp(source)
    .resize({ height: logoHeight, fit: "inside" })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 3,
      background: BRAND_COLOR,
    },
  })
    .composite([{ input: logoBuffer, gravity: "centre" }])
    .png()
    .toFile(path.join(publicDir, "og-image.png"));
}

async function generateFaviconIco() {
  const png16 = await sharp(source).resize(16, 16, { fit: "cover" }).png().toBuffer();
  const png32 = await sharp(source).resize(32, 32, { fit: "cover" }).png().toBuffer();
  const png48 = await sharp(source).resize(48, 48, { fit: "cover" }).png().toBuffer();

  const ico = await toIco([png16, png32, png48]);
  await fs.writeFile(path.join(publicDir, "favicon.ico"), ico);
}

async function main() {
  await fs.mkdir(iconsDir, { recursive: true });

  for (const { name, size } of iconSizes) {
    await generateSquareIcon(size, path.join(iconsDir, name));
    console.log(`Created ${name}`);
  }

  await generateSquareIcon(512, path.join(iconsDir, "icon-512-maskable.png"), 0.12);
  console.log("Created icon-512-maskable.png");

  await generateOgImage();
  console.log("Created og-image.png");

  await generateFaviconIco();
  console.log("Created favicon.ico");

  console.log("All icons generated from Munazzam-Logo.jpg");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
