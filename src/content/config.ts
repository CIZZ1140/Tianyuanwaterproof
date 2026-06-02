import { defineCollection, z } from 'astro:content';

const productsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    category: z.string().optional(),
    specs: z.union([
      z.array(z.object({
        label: z.string(),
        value: z.string(),
      })),
      z.record(z.string())
    ]).optional(),
  })
});

export const collections = {
  products: productsCollection,
};
