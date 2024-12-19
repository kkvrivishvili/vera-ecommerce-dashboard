"use client";

import { useState } from "react";
import PageTitle from "@/components/shared/PageTitle";
import AllProducts from "./products-table";
import ProductActions from "./ProductActions";
import ProductFilters from "./ProductFilters";
import { ProductFilters as ProductFiltersType } from "@/types/filters";

export default function Products() {
  const [filters, setFilters] = useState<ProductFiltersType>({});

  return (
    <section>
      <PageTitle>Products</PageTitle>

      <ProductActions />
      <ProductFilters onFiltersChange={setFilters} />
      <AllProducts filters={filters} />
    </section>
  );
}
