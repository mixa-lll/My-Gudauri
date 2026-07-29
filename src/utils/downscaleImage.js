const MAX_EDGE = 1600;
const QUALITY = 0.82;
const SKIP_TYPES = ['image/gif', 'image/svg+xml'];

/**
 * Shrink a picked photo before it leaves the browser.
 *
 * A phone shot is often 5–8 MB, and R2 would happily serve every byte of it to
 * every visitor. Resizing here costs nothing and needs no image service. Any
 * failure returns the original file, so an upload never breaks because of it.
 */
export async function downscaleImage(file, { maxEdge = MAX_EDGE, quality = QUALITY } = {}) {
  if (!file?.type?.startsWith('image/') || SKIP_TYPES.includes(file.type)) return file;
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') return file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size <= 900_000) return file;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
  } catch {
    return file;
  } finally {
    bitmap?.close?.();
  }
}
