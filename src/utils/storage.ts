export function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    if (!value) {
      return fallback;
    }
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readString(key: string, fallback = "") {
  return localStorage.getItem(key) ?? fallback;
}

export function writeString(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function removeValue(key: string) {
  localStorage.removeItem(key);
}
