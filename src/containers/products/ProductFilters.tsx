"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldAlert, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { fetchAllCategories } from "@/data/categories";
import { PRODUCT_SORT_OPTIONS } from "@/types/filters";
import type { ProductFilters as ProductFiltersType } from "@/types/filters";

const ALL_CATEGORIES = "all";

const filterSchema = z.object({
  search: z.string().optional(),
  category_slug: z.string().optional(),
  sort: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface ProductFiltersProps {
  onFiltersChange: (filters: ProductFiltersType) => void;
  defaultValues?: Partial<FilterFormValues>;
}

export default function ProductFilters({ onFiltersChange, defaultValues }: ProductFiltersProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      category_slug: ALL_CATEGORIES,
      sort: "",
      ...defaultValues,
    },
  });

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
    select: (data) =>
      data.map((item) => ({
        name: item.name,
        slug: item.slug,
      })),
  });

  // Watch form values and update filters
  useEffect(() => {
    const subscription = form.watch((value) => {
      const filters: ProductFiltersType = {};

      if (value.search) {
        filters.search = value.search;
      }

      if (value.category_slug && value.category_slug !== ALL_CATEGORIES) {
        filters.category_slug = value.category_slug;
      }

      if (value.sort) {
        const [field, order] = value.sort.split("-");
        filters.sort_by = field as any;
        filters.sort_order = order as any;
      }

      onFiltersChange(filters);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, onFiltersChange]);

  const onReset = () => {
    form.reset({
      search: "",
      category_slug: ALL_CATEGORIES,
      sort: "",
    });
    onFiltersChange({});
  };

  const formValues = form.watch();
  const hasActiveFilters = formValues.search || 
    formValues.category_slug !== ALL_CATEGORIES || 
    formValues.sort;

  const getActiveCategoryName = () => {
    if (!categories || formValues.category_slug === ALL_CATEGORIES) return null;
    const category = categories.find(c => c.slug === formValues.category_slug);
    return category?.name;
  };

  const getActiveSortName = () => {
    if (!formValues.sort) return null;
    const option = PRODUCT_SORT_OPTIONS.find(
      opt => `${opt.field}-${opt.order}` === formValues.sort
    );
    return option?.label;
  };

  const removeFilter = (field: keyof FilterFormValues) => {
    form.setValue(field, field === 'category_slug' ? ALL_CATEGORIES : '');
  };

  return (
    <>
      <Card className="mb-3">
        <Form {...form}>
          <form className="flex flex-col md:flex-row gap-4 lg:gap-6 p-4">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="md:basis-[30%]">
                  <FormControl>
                    <Input
                      type="search"
                      placeholder="Search product..."
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_slug"
              render={({ field }) => (
                <FormItem className="md:basis-1/5">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <div className="flex flex-col gap-2 items-center px-2 py-6">
                          <Loader2 className="size-4 animate-spin" />
                          <Typography>Loading...</Typography>
                        </div>
                      ) : isError || !categories ? (
                        <div className="flex flex-col gap-2 items-center px-2 py-6 max-w-full">
                          <ShieldAlert className="size-6" />
                          <Typography>
                            Sorry, something went wrong while fetching categories
                          </Typography>
                        </div>
                      ) : (
                        <>
                          <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.slug} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sort"
              render={({ field }) => (
                <FormItem className="md:basis-1/5">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUCT_SORT_OPTIONS.map((option) => (
                        <SelectItem
                          key={`${option.field}-${option.order}`}
                          value={`${option.field}-${option.order}`}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-[30%]">
              <Button
                type="submit"
                size="lg"
                className="flex-grow"
              >
                Filter
              </Button>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                className="flex-grow"
                onClick={onReset}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {formValues.search && (
            <Badge variant="secondary" className="gap-2">
              Search: {formValues.search}
              <Button
                variant="ghost"
                size="icon"
                className="size-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('search')}
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}

          {formValues.category_slug !== ALL_CATEGORIES && getActiveCategoryName() && (
            <Badge variant="secondary" className="gap-2">
              Category: {getActiveCategoryName()}
              <Button
                variant="ghost"
                size="icon"
                className="size-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('category_slug')}
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}

          {formValues.sort && getActiveSortName() && (
            <Badge variant="secondary" className="gap-2">
              Sort: {getActiveSortName()}
              <Button
                variant="ghost"
                size="icon"
                className="size-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('sort')}
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </>
  );
}
