import { promises as fs } from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

/*
 * Cuts the flat plate out of the vehicle-type artwork so the drawings sit on
 * any surface without carrying a rectangle with them.
 *
 * The fill starts from the border and only crosses pixels close to the plate
 * colour, so light parts *inside* the car — headlights, wheel hubs — are never
 * reached. That is the whole reason for a flood fill rather than a colour
 * threshold, which would punch holes in exactly those places.
 *
 * Run with: node scripts/cutout-vehicle-icons.mjs
 */

const DIRECTORY = path.resolve(process.cwd(), 'assets/vehicle-types');
const TOLERANCE = 26;

function readChunks(buffer) {
  const chunks = [];
  let offset = 8;
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    chunks.push({ type, data: buffer.subarray(offset + 8, offset + 8 + length) });
    offset += length + 12;
  }
  return chunks;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

/** Undo the per-row PNG filters into flat RGBA rows. */
function unfilter(raw, width, height, channels) {
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);
  let position = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[position];
    position += 1;
    const row = raw.subarray(position, position + stride);
    position += stride;
    const target = out.subarray(y * stride, (y + 1) * stride);
    const previous = y ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let x = 0; x < stride; x += 1) {
      const left = x >= channels ? target[x - channels] : 0;
      const up = previous[x];
      const upLeft = x >= channels ? previous[x - channels] : 0;
      let value = row[x];
      if (filter === 1) value += left;
      else if (filter === 2) value += up;
      else if (filter === 3) value += (left + up) >> 1;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const dl = Math.abs(p - left);
        const du = Math.abs(p - up);
        const dul = Math.abs(p - upLeft);
        value += dl <= du && dl <= dul ? left : du <= dul ? up : upLeft;
      }
      target[x] = value & 0xff;
    }
  }
  return out;
}

function encode(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function cutout(width, height, rgba) {
  const index = (x, y) => (y * width + x) * 4;
  const seed = [rgba[0], rgba[1], rgba[2]];
  const near = (i) => Math.abs(rgba[i] - seed[0]) + Math.abs(rgba[i + 1] - seed[1]) + Math.abs(rgba[i + 2] - seed[2]) <= TOLERANCE * 3;
  const seen = new Uint8Array(width * height);
  const queue = [];
  for (let x = 0; x < width; x += 1) { queue.push([x, 0], [x, height - 1]); }
  for (let y = 0; y < height; y += 1) { queue.push([0, y], [width - 1, y]); }

  while (queue.length) {
    const [x, y] = queue.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const flat = y * width + x;
    if (seen[flat]) continue;
    const i = index(x, y);
    if (!near(i)) continue;
    seen[flat] = 1;
    rgba[i + 3] = 0;
    queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return rgba;
}

const files = (await fs.readdir(DIRECTORY)).filter((name) => name.endsWith('.png'));
for (const name of files) {
  const file = path.join(DIRECTORY, name);
  const chunks = readChunks(await fs.readFile(file));
  const header = chunks.find((item) => item.type === 'IHDR').data;
  const width = header.readUInt32BE(0);
  const height = header.readUInt32BE(4);
  const colourType = header[9];
  if (header[8] !== 8 || ![2, 6].includes(colourType)) throw new Error(`${name}: unsupported PNG (depth ${header[8]}, colour ${colourType}).`);
  const channels = colourType === 6 ? 4 : 3;
  const data = zlib.inflateSync(Buffer.concat(chunks.filter((item) => item.type === 'IDAT').map((item) => item.data)));
  const flat = unfilter(data, width, height, channels);

  const rgba = Buffer.alloc(width * height * 4, 255);
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    rgba[pixel * 4] = flat[pixel * channels];
    rgba[pixel * 4 + 1] = flat[pixel * channels + 1];
    rgba[pixel * 4 + 2] = flat[pixel * channels + 2];
    rgba[pixel * 4 + 3] = channels === 4 ? flat[pixel * channels + 3] : 255;
  }

  await fs.writeFile(file, encode(width, height, cutout(width, height, rgba)));
  console.log(`${name}: cut out (${width}×${height})`);
}
