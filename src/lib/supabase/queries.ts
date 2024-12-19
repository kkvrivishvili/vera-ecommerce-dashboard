import { supabase } from "@/lib/supabase";
import { PaginationData, PaginationQueryProps } from "@/types/pagination";

const DEFAULT_SELECT = '*';
const DEFAULT_ORDER = { column: 'created_at', ascending: false };

export async function getPaginatedData<T>({
  table,
  page,
  perPage = 10,
  select = DEFAULT_SELECT,
  orderBy = DEFAULT_ORDER,
}: {
  table: string;
  page: number;
  perPage?: number;
  select?: string;
  orderBy?: { column: string; ascending: boolean };
}) {
  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    const total = count || 0;
    const pages = Math.ceil(total / perPage);
    const currentPage = Math.min(page, pages);
    const start = (currentPage - 1) * perPage;
    const end = start + perPage - 1;

    // Get paginated data
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .range(start, end)
      .order(orderBy.column, { ascending: orderBy.ascending });

    if (error) {
      throw error;
    }

    return {
      items: data as T[],
      meta: {
        page: currentPage,
        per_page: perPage,
        total,
        pages,
        first: 1,
        last: pages,
      }
    } as PaginationData<T>;
  } catch (error) {
    console.error('Error fetching paginated data:', error);
    throw error;
  }
}

export async function createRecord<T>(
  table: string,
  data: Record<string, any>,
  select: string = DEFAULT_SELECT
) {
  const { data: record, error } = await supabase
    .from(table)
    .insert([data])
    .select(select)
    .single();

  if (error) {
    throw error;
  }

  return record as T;
}

export async function updateRecord<T>(
  table: string,
  id: string,
  updates: Record<string, any>,
  select: string = DEFAULT_SELECT
) {
  const { data: record, error } = await supabase
    .from(table)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(select)
    .single();

  if (error) {
    throw error;
  }

  return record as T;
}

export async function deleteRecord(
  table: string,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}
