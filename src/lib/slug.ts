export function isImageUrl(value?: string): value is string {
  return !!value && (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/"));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
