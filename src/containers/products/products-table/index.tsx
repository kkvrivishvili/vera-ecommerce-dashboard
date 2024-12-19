"use client";

import { columns, skeletonColumns } from "./columns";
import ProductsTable from "./Table";
import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";
import { fetchProducts } from "@/data/products";
import { usePagination } from "@/hooks/usePagination";
import { Product } from "@/types/product";
import { PaginationData } from "@/types/pagination";
import { ProductFilters } from "@/types/filters";

type Props = {
  perPage?: number;
  filters?: ProductFilters;
};

export default function AllProducts({ perPage = 10, filters }: Props) {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = usePagination<PaginationData<Product>>({
    queryKey: ["products", filters],
    fetchFn: (params) => fetchProducts({ ...params, filters }),
    perPage,
  });

  if (isLoading)
    return <TableSkeleton perPage={perPage} columns={skeletonColumns} />;

  if (isError || !products)
    return (
      <TableError
        errorMessage="Something went wrong while trying to fetch products."
        refetch={refetch}
      />
    );

  return (
    <ProductsTable
      data={products.items}
      columns={columns}
      pagination={{
        items: products.meta.total,
        pages: products.meta.pages,
        current: products.meta.page,
        perPage: products.meta.per_page,
      }}
    />
  );
}
