import { Product } from "@/types/product";
import { PaginationQueryProps } from "@/types/pagination";
import { createRecord, deleteRecord, getPaginatedData, updateRecord } from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase";
import { ProductFilters } from "@/types/filters";

const PRODUCT_SELECT = `
  *,
  category:categories(
    id,
    name,
    slug,
    description,
    image_url,
    color,
    icon,
    is_active,
    display_order
  )
`;

export const fetchProducts = async ({
  page,
  perPage = 10,
  filters,
}: PaginationQueryProps & { filters?: ProductFilters }) => {
  // First get category id if category_slug is provided
  let categoryId: string | undefined;
  if (filters?.category_slug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filters.category_slug)
      .single();
    
    if (category) {
      categoryId = category.id;
    }
  }

  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' });

  // Apply filters
  if (filters) {
    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    if (filters.min_price !== undefined) {
      query = query.gte('price', filters.min_price);
    }

    if (filters.max_price !== undefined) {
      query = query.lte('price', filters.max_price);
    }

    if (filters.min_stock !== undefined) {
      query = query.gte('stock_quantity', filters.min_stock);
    }

    if (filters.max_stock !== undefined) {
      query = query.lte('stock_quantity', filters.max_stock);
    }

    // Apply sorting
    if (filters.sort_by && filters.sort_order) {
      query = query.order(filters.sort_by, { ascending: filters.sort_order === 'asc' });
    }
  }

  // Apply pagination
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;
  query = query.range(start, end);

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  const total = count || 0;
  const pages = Math.ceil(total / perPage);

  return {
    items: data as Product[],
    meta: {
      page,
      per_page: perPage,
      total,
      pages,
      first: 1,
      last: pages,
    }
  };
};

export type CreateProductData = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category' | 'rating' | 'reviews_count'>;

export const createProduct = async (product: CreateProductData) => {
  // Ensure decimal precision for prices
  const formattedProduct = {
    ...product,
    price: Number(product.price.toFixed(2)),
    discount_price: product.discount_price ? Number(product.discount_price.toFixed(2)) : null,
    rating: 0,
    reviews_count: 0,
  };

  return createRecord<Product>('products', formattedProduct, PRODUCT_SELECT);
};

export const updateProduct = async (id: string, updates: Partial<CreateProductData>) => {
  // Ensure decimal precision for prices if they're being updated
  const formattedUpdates = {
    ...updates,
    ...(updates.price !== undefined && { price: Number(updates.price.toFixed(2)) }),
    ...(updates.discount_price !== undefined && { 
      discount_price: updates.discount_price ? Number(updates.discount_price.toFixed(2)) : null 
    }),
  };

  return updateRecord<Product>('products', id, formattedUpdates, PRODUCT_SELECT);
};

export const deleteProduct = async (id: string) => {
  // First check if the product exists
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('id')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error('Product not found');
  }

  return deleteRecord('products', id);
};
