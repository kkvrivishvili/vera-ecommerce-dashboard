export type CategorySlug = 'protein' | 'lowCarb' | 'vegan' | 'vegetarian';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string | null;
  image_url: string | null;
  color: string | null;
  icon: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
