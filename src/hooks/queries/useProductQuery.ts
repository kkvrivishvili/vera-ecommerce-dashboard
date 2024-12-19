import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

export const fetchProduct = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select(`
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
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as Product;
};

export function useProductQuery(id: string | null) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => (id ? fetchProduct(id) : null),
    enabled: !!id,
  });
}
