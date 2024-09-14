export function getThumbnailUrl(id: number): string {
  return new URL(`../assets/thumbnail/${id}.png`, import.meta.url).href;
}
