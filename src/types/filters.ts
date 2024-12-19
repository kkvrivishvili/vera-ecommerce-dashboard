export type SortOrder = 'asc' | 'desc';

export type ProductSortField = 'price' | 'created_at' | 'updated_at' | 'title' | 'stock_quantity';

export interface ProductFilters {
  search?: string;
  category_slug?: string;
  is_active?: boolean;
  min_price?: number;
  max_price?: number;
  min_stock?: number;
  max_stock?: number;
  sort_by?: ProductSortField;
  sort_order?: SortOrder;
}

export const PRODUCT_SORT_OPTIONS = [
  { label: 'Price (Low to High)', field: 'price', order: 'asc' },
  { label: 'Price (High to Low)', field: 'price', order: 'desc' },
  { label: 'Name (A-Z)', field: 'title', order: 'asc' },
  { label: 'Name (Z-A)', field: 'title', order: 'desc' },
  { label: 'Stock (Low to High)', field: 'stock_quantity', order: 'asc' },
  { label: 'Stock (High to Low)', field: 'stock_quantity', order: 'desc' },
  { label: 'Newest First', field: 'created_at', order: 'desc' },
  { label: 'Oldest First', field: 'created_at', order: 'asc' },
  { label: 'Recently Updated', field: 'updated_at', order: 'desc' },
  { label: 'Least Recently Updated', field: 'updated_at', order: 'asc' },
] as const;
