// Génère les icônes PWA en PNG pur (sans dépendance) : montagne + soleil
// sur fond teal — cohérent avec le design system de l'application.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(outDir, { recursive: true });

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePNG(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filtre none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Dessine l'icône : ciel dégradé, soleil doré, deux montagnes, rivière. */
function drawIcon(size, { padding = 0, rounded = true } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const inner = size - padding * 2;
  const radius = rounded ? inner * 0.22 : 0;

  const set = (x, y, r, g, b, a = 255) => {
    const i = (y * size + x) * 4;
    buf[i] = r;
    buf[i + 1] = g;
    buf[i + 2] = b;
    buf[i + 3] = a;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const ix = x - padding;
      const iy = y - padding;
      // extérieur du carré arrondi → transparent
      if (ix < 0 || iy < 0 || ix >= inner || iy >= inner) {
        set(x, y, 0, 0, 0, 0);
        continue;
      }
      if (rounded) {
        const cx = Math.max(radius - ix, ix - (inner - 1 - radius), 0);
        const cy = Math.max(radius - iy, iy - (inner - 1 - radius), 0);
        if (cx * cx + cy * cy > radius * radius) {
          set(x, y, 0, 0, 0, 0);
          continue;
        }
      }
      const t = iy / inner;
      // ciel : dégradé teal profond → teal clair
      let r = Math.round(11 + t * 20);
      let g = Math.round(94 + t * 40);
      let b = Math.round(87 + t * 35);

      // soleil doré
      const sx = inner * 0.68;
      const sy = inner * 0.3;
      const sr = inner * 0.14;
      const dSun = Math.hypot(ix - sx, iy - sy);
      if (dSun < sr) {
        r = 240;
        g = 190;
        b = 70;
      } else if (dSun < sr * 1.25) {
        const mix = (dSun - sr) / (sr * 0.25);
        r = Math.round(240 * (1 - mix) + r * mix);
        g = Math.round(190 * (1 - mix) + g * mix);
        b = Math.round(70 * (1 - mix) + b * mix);
      }

      // montagne arrière (claire)
      const m1Peak = { x: inner * 0.32, y: inner * 0.38 };
      const m1 = Math.abs(ix - m1Peak.x) * 0.95 + m1Peak.y;
      if (iy > m1) {
        r = 22;
        g = 130;
        b = 118;
      }
      // montagne avant (sombre)
      const m2Peak = { x: inner * 0.62, y: inner * 0.52 };
      const m2 = Math.abs(ix - m2Peak.x) * 1.1 + m2Peak.y;
      if (iy > m2) {
        r = 10;
        g = 60;
        b = 54;
      }
      // bandeau bas
      if (iy > inner * 0.87) {
        r = 8;
        g = 46;
        b = 42;
      }
      set(x, y, r, g, b, 255);
    }
  }
  return encodePNG(size, size, buf);
}

writeFileSync(join(outDir, 'icon-192.png'), drawIcon(192));
writeFileSync(join(outDir, 'icon-512.png'), drawIcon(512));
writeFileSync(join(outDir, 'maskable-512.png'), drawIcon(512, { padding: 56, rounded: false }));
writeFileSync(join(outDir, 'apple-touch-icon.png'), drawIcon(180, { rounded: false }));
console.log('Icônes générées dans public/');
