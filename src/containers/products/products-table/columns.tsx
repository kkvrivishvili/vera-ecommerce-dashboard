import Link from "next/link";
import Image from "next/image";
import { ZoomIn, PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import Typography from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatAmount } from "@/helpers/formatAmount";

import { Product } from "@/types/product";
import { SkeletonColumn } from "@/types/skeleton";
import { useProductMutations } from "@/hooks/mutations/useProductMutations";
import EditProductForm from "../edit-product-form";
import React from "react";

export const columns = (): ColumnDef<Product>[] => {
  const { updateProduct, deleteProduct } = useProductMutations();

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      header: "product name",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          {row.original.image_url && (
            <Image
              src={row.original.image_url}
              alt={row.original.title}
              width={32}
              height={32}
              className="size-8 rounded-full"
            />
          )}
          <Typography className="capitalize block truncate">
            {row.original.title}
          </Typography>
        </div>
      ),
    },
    {
      header: "category",
      cell: ({ row }) => (
        <Typography className="block max-w-52 truncate">
          {row.original.category?.name || "No Category"}
        </Typography>
      ),
    },
    {
      header: "price",
      cell: ({ row }) => formatAmount(row.original.price),
    },
    {
      accessorKey: "stock_quantity",
      header: "Stock",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge
            variant={row.original.stock_quantity > 0 ? "default" : "destructive"}
          >
            {row.original.stock_quantity}
          </Badge>
        </div>
      ),
    },
    {
      header: "rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span>⭐</span>
          <span>{row.original.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">
            ({row.original.reviews_count})
          </span>
        </div>
      ),
    },
    {
      header: "active",
      cell: ({ row }) => (
        <Switch
          checked={row.original.is_active}
          onCheckedChange={(checked) => {
            updateProduct({
              id: row.original.id,
              updates: { is_active: checked },
            });
          }}
          aria-label="Toggle product status"
        />
      ),
    },
    {
      header: "actions",
      cell: ({ row }) => {
        const [open, setOpen] = React.useState(false);

        const handleSuccess = () => {
          setOpen(false);
        };

        return (
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" asChild>
                  <Link href={`/products/${row.original.id}`}>
                    <ZoomIn className="size-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View details</TooltipContent>
            </Tooltip>

            <Sheet open={open} onOpenChange={setOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <PenSquare className="size-4" />
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>Edit product</TooltipContent>
              </Tooltip>

              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit product</SheetTitle>
                  <SheetDescription>
                    Make changes to the product here. Click save when you're done.
                  </SheetDescription>
                </SheetHeader>
                <EditProductForm product={row.original} onSuccess={handleSuccess} />
              </SheetContent>
            </Sheet>

            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Trash2 className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Delete product</TooltipContent>
              </Tooltip>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    product from the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteProduct(row.original.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
};

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "",
    cell: <Checkbox disabled />,
  },
  {
    header: "product name",
    cell: (
      <div className="flex items-center gap-2">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    ),
  },
  {
    header: "category",
    cell: <Skeleton className="h-4 w-24" />,
  },
  {
    header: "price",
    cell: <Skeleton className="h-4 w-16" />,
  },
  {
    header: "stock",
    cell: <Skeleton className="h-4 w-12" />,
  },
  {
    header: "rating",
    cell: <Skeleton className="h-4 w-20" />,
  },
  {
    header: "active",
    cell: <Switch disabled />,
  },
  {
    header: "actions",
    cell: (
      <div className="flex items-center gap-2">
        <Skeleton className="size-8" />
        <Skeleton className="size-8" />
        <Skeleton className="size-8" />
      </div>
    ),
  },
];
