import { Category } from "./category";

export interface Product {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  discount_price: number | null;
  category_id: string | null;
  category?: Category;
  is_active: boolean;
  stock_quantity: number;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}
