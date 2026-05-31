const sharp = require('sharp');

// Favicon tuned for small sizes: softer corners, inset card, and shorter mark.
const svgFavicon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#F4F7F6" rx="132"/>
  <rect x="44" y="44" width="424" height="424" fill="#314841" rx="112"/>
  <rect x="74" y="74" width="364" height="364" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="10" rx="94"/>
  <text x="256" y="312" text-anchor="middle" font-family="Georgia, serif" font-size="188" font-weight="700" fill="#FCFCFB">E</text>
  <text x="256" y="390" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="700" letter-spacing="9" fill="#B8CBC3">M T</text>
</svg>
`;

async function generateFavicons() {
  const buffer = Buffer.from(svgFavicon);

  await sharp(buffer).resize(16, 16).png().toFile('public/favicon-16x16.png');
  await sharp(buffer).resize(32, 32).png().toFile('public/favicon-32x32.png');
  await sharp(buffer).resize(48, 48).png().toFile('public/favicon.ico');
  await sharp(buffer).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(buffer).resize(192, 192).png().toFile('public/android-chrome-192x192.png');
  await sharp(buffer).resize(512, 512).png().toFile('public/android-chrome-512x512.png');

  console.log('✓ Generated rounded favicon set');
}

generateFavicons().catch((error) => {
  console.error(error);
  process.exit(1);
});
