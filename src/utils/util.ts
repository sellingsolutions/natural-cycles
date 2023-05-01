export function resolve(path: string): string {
  return new URL(path, import.meta.url).toString();
}