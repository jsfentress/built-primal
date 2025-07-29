import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";
export const PRODUCTS_PATH = "src/content/products";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const products = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${PRODUCTS_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      price: z.number(),
      stripe_url: z.string(),
      image: image().or(z.string()).optional(),
      summary: z.string(),
    }),
});

export const collections = { blog, products };
