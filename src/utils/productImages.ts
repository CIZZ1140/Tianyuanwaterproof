import manifest from '../data/product-images.json';

type Variant = { src: string; width: number; height: number; bytes: number };
type ImageEntry = { width: number; height: number; variants: Record<string, Variant> };
const images = manifest as Record<string, ImageEntry>;

/** Only use derivatives actually generated; never guess remote variant URLs. */
export function productImage(url: string, size = 800) {
  return images[url]?.variants[String(size)];
}

export function productImageSet(url: string) {
  const image = images[url];
  if (!image) return undefined;
  const candidates = new Map<number, string>();
  for (const size of [480, 800, 1200]) {
    const variant = image.variants[String(size)];
    candidates.set(variant.width, variant.src);
  }
  return [...candidates].map(([width, src]) => `${src} ${width}w`).join(', ');
}
