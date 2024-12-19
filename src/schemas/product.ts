import * as z from "zod";
import { CategorySlug } from "@/types/category";

export const productSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .nullable(),
  image_url: z
    .string()
    .url("Image URL must be a valid URL")
    .nullable(),
  price: z
    .number()
    .min(0, "Price must be greater than 0")
    .max(999999.99, "Price must be less than 1,000,000")
    .transform(val => Number(val.toFixed(2))), // Ensure DECIMAL(10,2)
  discount_price: z
    .number()
    .min(0, "Discount price must be greater than 0")
    .max(999999.99, "Discount price must be less than 1,000,000")
    .transform(val => val ? Number(val.toFixed(2)) : null) // Ensure DECIMAL(10,2)
    .nullable(),
  category_id: z
    .string()
    .uuid("Category ID must be a valid UUID")
    .nullable(),
  is_active: z
    .boolean()
    .default(true),
  stock_quantity: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock must be greater than or equal to 0")
    .default(0),
});

export type ProductFormData = z.infer<typeof productSchema>;
