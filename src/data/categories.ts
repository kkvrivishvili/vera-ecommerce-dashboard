import { supabase } from "@/lib/supabase";
import { Category } from "@/types/category";
import { PaginationQueryProps } from "@/types/pagination";
import { createRecord, deleteRecord, getPaginatedData, updateRecord } from "@/lib/supabase/queries";

export const fetchCategories = async ({
  page,
  perPage = 10,
}: PaginationQueryProps) => {
  return getPaginatedData<Category>({
    table: 'categories',
    page,
    perPage,
    select: `
      id,
      name,
      slug,
      description,
      image_url,
      color,
      icon,
      is_active,
      display_order,
      created_at,
      updated_at
    `,
    orderBy: { column: 'display_order', ascending: true },
  });
};

export const fetchAllCategories = async () => {
  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      color,
      icon,
      is_active,
      display_order
    `)
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return categories as Category[];
};

export const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
  // Validate that the slug is unique
  const { data: existingCategory, error: checkError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', category.slug)
    .single();

  if (existingCategory) {
    throw new Error('A category with this slug already exists');
  }

  if (checkError && checkError.code !== 'PGRST116') {
    throw checkError;
  }

  // Get max display_order
  const { data: maxOrder } = await supabase
    .from('categories')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single();

  const nextOrder = maxOrder ? maxOrder.display_order + 1 : 0;

  return createRecord<Category>('categories', {
    ...category,
    display_order: category.display_order ?? nextOrder,
  });
};

export const updateCategory = async (id: string, updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>) => {
  // If updating slug, validate it's unique
  if (updates.slug) {
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', updates.slug)
      .neq('id', id)
      .single();

    if (existingCategory) {
      throw new Error('A category with this slug already exists');
    }
  }

  // If updating is_active to false, update all related products
  if (updates.is_active === false) {
    const { error: productsError } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('category_id', id);

    if (productsError) {
      throw productsError;
    }
  }

  return updateRecord<Category>('categories', id, updates);
};

export const deleteCategory = async (id: string) => {
  // First check if the category exists
  const { data: category, error: fetchError } = await supabase
    .from('categories')
    .select('id')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error('Category not found');
  }

  // Check if there are products using this category
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if (count && count > 0) {
    // Update products to remove category reference
    await supabase
      .from('products')
      .update({ category_id: null })
      .eq('category_id', id);
  }

  return deleteRecord('categories', id);
};
