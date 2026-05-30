export function formatDate(date: string | Date, locale = "zh-CN"): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const chineseCharsPerMinute = 400;
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const words = text.replace(/[一-鿿]/g, "").split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(chineseChars / chineseCharsPerMinute + words / wordsPerMinute);
  return Math.max(1, minutes);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
