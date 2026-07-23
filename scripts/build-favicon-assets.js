#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const masterPath = path.join(root, "assets", "ispy-orb-live-master.svg");
const reviewDir = path.join(root, "design-reviews");
const sourceVersion = path.resolve(root, "..", "i-spy-website-selected-concept-v0.11.9-ab");
const masterSvg = fs.readFileSync(masterPath, "utf8");
const embeddedMatch = masterSvg.match(/base64,([^"]+)/);

if (!embeddedMatch) {
  throw new Error("The approved orb master does not contain its expected embedded PNG.");
}

const before180 = fs.readFileSync(path.join(sourceVersion, "apple-touch-icon.png"));
const embeddedPng = Buffer.from(embeddedMatch[1], "base64");
const canvasSize = 2048;
const innerSize = 1946;
const clearance = (canvasSize - innerSize) / 2;

const faviconSvg = masterSvg.replace(
  '<svg width="80" height="80" viewBox="0 0 80 80"',
  '<svg width="100" height="100" viewBox="-2.105263 -2.105263 84.210526 84.210526"'
);

if (faviconSvg === masterSvg) {
  throw new Error("The approved orb master root could not be converted to the dedicated favicon canvas.");
}

fs.writeFileSync(path.join(root, "favicon.svg"), faviconSvg);
fs.mkdirSync(reviewDir, { recursive: true });

function pngDataUri(buffer) {
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

async function renderPng(source, size) {
  return sharp(source)
    .resize(size, size, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .keepIccProfile()
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(images.length * 16);
  let offset = header.length + directory.length;

  images.forEach(({ size, buffer }, index) => {
    const entry = index * 16;
    directory.writeUInt8(size === 256 ? 0 : size, entry);
    directory.writeUInt8(size === 256 ? 0 : size, entry + 1);
    directory.writeUInt8(0, entry + 2);
    directory.writeUInt8(0, entry + 3);
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(buffer.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += buffer.length;
  });

  return Buffer.concat([header, directory, ...images.map(({ buffer }) => buffer)]);
}

function comparisonSvg({ dark, before, after }) {
  const background = dark ? "#0A1929" : "#F7F6F4";
  const card = dark ? "#14283B" : "#FFFFFF";
  const text = dark ? "#FFFFFF" : "#0A1929";
  const muted = dark ? "#C7D0D8" : "#52606C";
  const beforeUri = pngDataUri(before);
  const afterUri = pngDataUri(after);

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
  <rect width="1200" height="720" fill="${background}"/>
  <style>
    text { font-family: Arial, Helvetica, sans-serif; fill: ${text}; }
    .title { font-size: 34px; font-weight: 700; }
    .label { font-size: 24px; font-weight: 700; }
    .small { font-size: 18px; fill: ${muted}; }
  </style>
  <text class="title" x="70" y="62">i-Spy favicon refinement · v0.11.9-ac</text>
  <rect x="70" y="94" width="500" height="390" rx="24" fill="${card}"/>
  <rect x="630" y="94" width="500" height="390" rx="24" fill="${card}"/>
  <text class="label" x="110" y="142">Before</text>
  <text class="label" x="670" y="142">After · dedicated 95% master</text>
  <image href="${beforeUri}" x="190" y="170" width="260" height="260"/>
  <image href="${afterUri}" x="750" y="170" width="260" height="260"/>
  <text class="small" x="70" y="530">Small-size previews</text>
  <image href="${beforeUri}" x="245" y="548" width="16" height="16"/>
  <image href="${beforeUri}" x="285" y="540" width="32" height="32"/>
  <image href="${beforeUri}" x="340" y="532" width="48" height="48"/>
  <image href="${afterUri}" x="805" y="548" width="16" height="16"/>
  <image href="${afterUri}" x="845" y="540" width="32" height="32"/>
  <image href="${afterUri}" x="900" y="532" width="48" height="48"/>
  <circle cx="290" cy="646" r="54" fill="#DADCE0"/>
  <circle cx="850" cy="646" r="54" fill="#DADCE0"/>
  <image href="${beforeUri}" x="258" y="614" width="64" height="64"/>
  <image href="${afterUri}" x="818" y="614" width="64" height="64"/>
  <text class="small" x="70" y="707">Simulated circular search presentation. Google controls the surrounding container.</text>
</svg>`);
}

async function main() {
  const tightlyCroppedMaster = await sharp(embeddedPng)
    .resize(innerSize, innerSize, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .extend({
      top: clearance,
      bottom: clearance,
      left: clearance,
      right: clearance,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .keepIccProfile()
    .png({ compressionLevel: 9 })
    .toBuffer();

  const sizes = [16, 32, 48, 96, 180];
  const rendered = new Map();

  for (const size of sizes) {
    rendered.set(size, await renderPng(tightlyCroppedMaster, size));
  }

  fs.writeFileSync(path.join(root, "favicon-32x32.png"), rendered.get(32));
  fs.writeFileSync(path.join(root, "favicon-48x48.png"), rendered.get(48));
  fs.writeFileSync(path.join(root, "favicon-96x96.png"), rendered.get(96));
  fs.writeFileSync(path.join(root, "apple-touch-icon.png"), rendered.get(180));
  fs.writeFileSync(
    path.join(root, "favicon.ico"),
    buildIco([16, 32, 48].map((size) => ({ size, buffer: rendered.get(size) })))
  );

  await sharp(comparisonSvg({
    dark: false,
    before: before180,
    after: rendered.get(180),
  })).png().toFile(path.join(reviewDir, "favicon-before-after-light-v0.11.9-ac.png"));

  await sharp(comparisonSvg({
    dark: true,
    before: before180,
    after: rendered.get(180),
  })).png().toFile(path.join(reviewDir, "favicon-before-after-dark-v0.11.9-ac.png"));

  console.log("Generated dedicated favicon master, ICO, PNG exports and comparison images.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
