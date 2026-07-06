import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'content',
  schema: z.any()
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      'roofing',
      'basement',
      'coatings',
      'installation',
      'industry-insights',
      'product-guides'
    ]),
    coverImage: z.string().optional(),
    coverAlt: z.string().optional(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Tianyuan Waterproof Technical Team'),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([])
  })
});

export const collections = {
  products,
  blog
};
