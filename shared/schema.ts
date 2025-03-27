import { pgTable, text, serial, integer, boolean, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Product Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  originalPrice: real("original_price").notNull(),
  category: text("category").notNull().default("").notNull(),
  weight: real("weight"),
  seller: text("seller").notNull().default("").notNull(),
  imageUrl: text("image_url").notNull().default("").notNull(),
  website: text("website").notNull(),
  createdAt: text("created_at").notNull(),
});

export const productSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof productSchema>;

// URL Schema for validation
export const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export type UrlRequest = z.infer<typeof urlSchema>;

// Cost breakdown response schema
export const costBreakdownSchema = z.object({
  productPriceINR: z.string(),
  exchangeRate: z.number(),
  productPriceNPR: z.string(),
  customsDuty: z.string(),
  shippingCost: z.string(),
  totalCostNPR: z.string(),
});

export type CostBreakdown = z.infer<typeof costBreakdownSchema>;

// Product details with cost breakdown response schema
export const productDetailsSchema = z.object({
  product: z.object({
    title: z.string(),
    originalPrice: z.string(),
    category: z.string().optional(),
    weight: z.string().optional(),
    seller: z.string().optional(),
    imageUrl: z.string().optional(),
    website: z.string(),
  }),
  costBreakdown: costBreakdownSchema,
});

export type ProductDetails = z.infer<typeof productDetailsSchema>;

// Cache entry for scraped products
export interface CacheEntry {
  product: Product;
  costBreakdown: CostBreakdown;
  timestamp: number;
}
