"use client";

import { columns, skeletonColumns } from "./columns";
import CategoriesTable from "./Table";
import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";
import { fetchCategories } from "@/data/categories";
import { usePagination } from "@/hooks/usePagination";
import { Category } from "@/types/category";
import { PaginationData } from "@/types/pagination";

type Props = {
  perPage?: number;
};

export default function AllCategories({ perPage = 10 }: Props) {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = usePagination<PaginationData<Category>>({
    queryKey: ["categories"],
    fetchFn: fetchCategories,
    perPage,
  });

  if (isLoading)
    return <TableSkeleton perPage={perPage} columns={skeletonColumns} />;

  if (isError || !categories)
    return (
      <TableError
        errorMessage="Something went wrong while trying to fetch categories."
        refetch={refetch}
      />
    );

  return (
    <CategoriesTable
      columns={columns}
      data={categories.items}
      pagination={{
        items: categories.meta.total,
        pages: categories.meta.pages,
        current: categories.meta.page,
        perPage: categories.meta.per_page,
      }}
    />
  );
}
