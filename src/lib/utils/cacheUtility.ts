const CACHE_PREFIX = "firestore_cache_";
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export function setCache<T>(
  key: string,
  data: T,
  expirationTime: number = DEFAULT_CACHE_TIME
): void {
  const cacheItem: CacheItem<T> = {
    data,
    timestamp: Date.now() + expirationTime,
  };
  localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheItem));
}

export function getCache<T>(key: string): T | null {
  const cachedItem = localStorage.getItem(CACHE_PREFIX + key);
  if (!cachedItem) return null;

  const { data, timestamp }: CacheItem<T> = JSON.parse(cachedItem);
  if (Date.now() > timestamp) {
    localStorage.removeItem(CACHE_PREFIX + key);
    return null;
  }

  return data;
}

export function clearCache(key?: string): void {
  if (key) {
    localStorage.removeItem(CACHE_PREFIX + key);
  } else {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  }
}
