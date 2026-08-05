import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const [inputPath, outputPath] = process.argv.slice(2)

if (!inputPath || !outputPath) {
  throw new Error('Usage: node scripts/build-animated-skier-svg.mjs <input.png> <output.svg>')
}

const { data, info } = await sharp(inputPath)
  .grayscale()
  .median(3)
  .threshold(82)
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height } = info
const stride = width + 1
const outgoing = new Map()

const isInk = (x, y) => x >= 0 && x < width && y >= 0 && y < height && data[y * width + x] === 0
const vertex = (x, y) => y * stride + x
const addEdge = (x1, y1, x2, y2) => {
  const start = vertex(x1, y1)
  const end = vertex(x2, y2)
  const edges = outgoing.get(start)
  if (edges) edges.push(end)
  else outgoing.set(start, [end])
}

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    if (!isInk(x, y)) continue
    if (!isInk(x, y - 1)) addEdge(x, y, x + 1, y)
    if (!isInk(x + 1, y)) addEdge(x + 1, y, x + 1, y + 1)
    if (!isInk(x, y + 1)) addEdge(x + 1, y + 1, x, y + 1)
    if (!isInk(x - 1, y)) addEdge(x, y + 1, x, y)
  }
}

const point = (id) => [id % stride, Math.floor(id / stride)]
const direction = (start, end) => {
  const [x1, y1] = point(start)
  const [x2, y2] = point(end)
  if (x2 > x1) return 0
  if (y2 > y1) return 1
  if (x2 < x1) return 2
  return 3
}

const takeEdge = (start, previousDirection = null) => {
  const edges = outgoing.get(start)
  if (!edges?.length) return null
  let index = edges.length - 1
  if (previousDirection !== null && edges.length > 1) {
    const preferred = [
      (previousDirection + 1) % 4,
      previousDirection,
      (previousDirection + 3) % 4,
      (previousDirection + 2) % 4,
    ]
    index = preferred
      .map((candidate) => edges.findIndex((end) => direction(start, end) === candidate))
      .find((candidateIndex) => candidateIndex >= 0)
  }
  return edges.splice(index, 1)[0]
}

const distanceToSegment = ([px, py], [ax, ay], [bx, by]) => {
  const dx = bx - ax
  const dy = by - ay
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay)
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

const simplifyOpen = (points, tolerance) => {
  if (points.length <= 2) return points
  let maxDistance = 0
  let splitIndex = 0
  for (let i = 1; i < points.length - 1; i += 1) {
    const distance = distanceToSegment(points[i], points[0], points.at(-1))
    if (distance > maxDistance) {
      maxDistance = distance
      splitIndex = i
    }
  }
  if (maxDistance <= tolerance) return [points[0], points.at(-1)]
  return [
    ...simplifyOpen(points.slice(0, splitIndex + 1), tolerance).slice(0, -1),
    ...simplifyOpen(points.slice(splitIndex), tolerance),
  ]
}

const simplifyClosed = (points, tolerance) => {
  const startIndex = points.reduce((best, current, index) => {
    const [x, y] = current
    const [bestX, bestY] = points[best]
    return x < bestX || (x === bestX && y < bestY) ? index : best
  }, 0)
  const rotated = [...points.slice(startIndex), ...points.slice(0, startIndex)]
  let oppositeIndex = 1
  let maxDistance = 0
  for (let i = 1; i < rotated.length; i += 1) {
    const distance = Math.hypot(rotated[i][0] - rotated[0][0], rotated[i][1] - rotated[0][1])
    if (distance > maxDistance) {
      maxDistance = distance
      oppositeIndex = i
    }
  }
  const first = simplifyOpen(rotated.slice(0, oppositeIndex + 1), tolerance)
  const second = simplifyOpen([...rotated.slice(oppositeIndex), rotated[0]], tolerance)
  return [...first.slice(0, -1), ...second.slice(0, -1)]
}

const contours = []
for (const [start, edges] of outgoing) {
  while (edges.length) {
    const ids = [start]
    let current = start
    let next = takeEdge(current)
    let previousDirection = direction(current, next)
    let guard = 0
    while (next !== null && next !== start && guard < 2_000_000) {
      ids.push(next)
      current = next
      next = takeEdge(current, previousDirection)
      if (next !== null) previousDirection = direction(current, next)
      guard += 1
    }
    if (next === start && ids.length >= 8) {
      const points = simplifyClosed(ids.map(point), 1.35)
      const area = Math.abs(points.reduce((sum, [x1, y1], index) => {
        const [x2, y2] = points[(index + 1) % points.length]
        return sum + x1 * y2 - x2 * y1
      }, 0) / 2)
      if (area >= 5) contours.push(points)
    }
  }
}

const format = (value) => Number(value.toFixed(1))
const pathData = contours
  .map((points) => `${points.map(([x, y], index) => `${index ? 'L' : 'M'}${format(x)} ${format(y)}`).join('')}Z`)
  .join('')

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="42 196 1170 790" role="img" aria-labelledby="title description">
  <title id="title">Анимированный лыжник</title>
  <desc id="description">Силуэт горнолыжника входит в поворот, под лыжами разлетается снег. Фон прозрачный.</desc>
  <style>
    :root { color: #101313; }
    .skier {
      fill: currentColor;
      fill-rule: evenodd;
      transform-box: view-box;
      transform-origin: 630px 675px;
      animation: carve 2.8s cubic-bezier(.45, 0, .55, 1) infinite;
    }
    .snow {
      fill: currentColor;
      transform-box: fill-box;
      transform-origin: center;
      animation: spray 2.8s cubic-bezier(.2, .7, .2, 1) infinite;
    }
    .snow:nth-child(2n) { animation-delay: -.34s; }
    .snow:nth-child(3n) { animation-delay: -.82s; }
    .snow:nth-child(5n) { animation-delay: -1.25s; }
    .carve-line {
      fill: none;
      stroke: currentColor;
      stroke-width: 10;
      stroke-linecap: round;
      opacity: .22;
      stroke-dasharray: 90 760;
      animation: trail 2.8s ease-in-out infinite;
    }
    @keyframes carve {
      0%, 100% { transform: translate(0, 0) rotate(-.7deg); }
      48% { transform: translate(7px, -9px) rotate(1.2deg); }
    }
    @keyframes spray {
      0%, 18% { opacity: 0; transform: translate(12px, 6px) scale(.35) rotate(-8deg); }
      44% { opacity: .9; }
      78%, 100% { opacity: 0; transform: translate(-34px, -21px) scale(1.08) rotate(16deg); }
    }
    @keyframes trail {
      0%, 100% { stroke-dashoffset: 0; opacity: .12; }
      52% { stroke-dashoffset: -215; opacity: .32; }
    }
    @media (prefers-reduced-motion: reduce) {
      .skier, .snow, .carve-line { animation: none; }
      .snow { opacity: .55; }
    }
  </style>
  <g aria-hidden="true">
    <path class="carve-line" d="M176 935C358 986 565 996 744 957"/>
    <ellipse class="snow" cx="250" cy="838" rx="11" ry="5" transform="rotate(38 250 838)"/>
    <ellipse class="snow" cx="301" cy="881" rx="8" ry="4" transform="rotate(27 301 881)"/>
    <ellipse class="snow" cx="359" cy="912" rx="13" ry="5" transform="rotate(16 359 912)"/>
    <ellipse class="snow" cx="774" cy="868" rx="12" ry="5" transform="rotate(-22 774 868)"/>
    <ellipse class="snow" cx="837" cy="843" rx="8" ry="4" transform="rotate(-31 837 843)"/>
    <ellipse class="snow" cx="907" cy="817" rx="6" ry="3" transform="rotate(-38 907 817)"/>
  </g>
  <path class="skier" d="${pathData}"/>
</svg>
`

await fs.mkdir(path.dirname(outputPath), { recursive: true })
await fs.writeFile(outputPath, svg)
console.log(`Created ${outputPath} with ${contours.length} contours (${Buffer.byteLength(svg)} bytes)`)
