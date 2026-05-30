import { defineConfig, s } from "velite";

export default defineConfig({
  collections: {
    posts: {
      name: "Post",
      pattern: "blog/**/*.mdx",
      schema: s
        .object({
          title: s.string(),
          slug: s.slug(),
          excerpt: s.string().optional(),
          category: s.string().default("devlog"),
          tags: s.array(s.string()).default([]),
          coverImage: s.string().optional(),
          publishedAt: s.isodate().optional(),
          updatedAt: s.isodate().optional(),
          draft: s.boolean().default(false),
          code: s.mdx(),
          toc: s.toc(),
          raw: s.raw(),
        })
        .transform((data) => ({
          ...data,
          readingTime: estimateReadingTime(data.raw),
        })),
    },
  },
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
  },
});

function estimateReadingTime(text: string): number {
  const chineseCharsPerMinute = 400;
  const wordsPerMinute = 200;
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const words = text.replace(/[一-鿿]/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(chineseChars / chineseCharsPerMinute + words / wordsPerMinute));
}
