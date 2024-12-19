import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { PaginationQueryProps } from "@/types/pagination";

interface UsePaginationProps<T> {
  queryKey: unknown[];
  fetchFn: (props: PaginationQueryProps) => Promise<T>;
  perPage?: number;
}

export function usePagination<T>({
  queryKey,
  fetchFn,
  perPage = 10,
}: UsePaginationProps<T>) {
  const searchParams = useSearchParams();
  const page = Math.max(1, Math.trunc(Number(searchParams.get("page"))) || 1);

  return useQuery({
    queryKey: [...queryKey, { page, perPage }],
    queryFn: () => fetchFn({ page, perPage }),
    placeholderData: keepPreviousData,
  });
}
