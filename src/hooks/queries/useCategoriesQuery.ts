import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "@/data/categories";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories", "all"],
    queryFn: fetchAllCategories,
  });
}
