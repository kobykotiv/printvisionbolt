import { z } from 'zod';

export const productInputSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  metadata: z.record(z.unknown()).optional(),
  images: z.array(z.string()).default([]),
  category_id: z.string().nullable(),
  store_id: z.string(),
  print_provider_id: z.string().nullable(),
  stock: z.number().default(0),
  vendor_id: z.string(),
  variants: z.array(z.record(z.unknown())).default([]),
  shipping_profile_id: z.string().nullable(),
});

export const orderInputSchema = z.object({
  store_id: z.string(),
  customer_id: z.string().nullable(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
  total: z.number().positive(),
  items: z.array(z.record(z.unknown())),
  shipping_address: z.record(z.unknown()),
  billing_address: z.record(z.unknown()),
  metadata: z.record(z.unknown()).optional(),
  tracking_number: z.string().optional(),
  provider_order_id: z.string().optional(),
  notes: z.string().optional(),
  currency: z.string().default('USD'),
  tax_amount: z.number().default(0),
  shipping_amount: z.number().default(0),
  discount_amount: z.number().default(0)
});

export const storeInputSchema = z.object({
  name: z.string().min(1),
  domain: z.string(),
  owner_id: z.string(),
  settings: z.record(z.unknown()).optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  metadata: z.record(z.unknown()).optional(),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type OrderInput = z.infer<typeof orderInputSchema>;
export type StoreInput = z.infer<typeof storeInputSchema>;