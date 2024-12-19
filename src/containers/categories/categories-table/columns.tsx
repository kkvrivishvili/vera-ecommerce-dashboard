import Image from "next/image";
import { PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
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

import { SkeletonColumn } from "@/types/skeleton";
import { Category } from "@/types/category";

const handleSwitchChange = () => {};

export const columns: ColumnDef<Category>[] = [
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
    header: "category",
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        {row.original.image_url && (
          <Image
            src={row.original.image_url}
            alt={row.original.name}
            width={32}
            height={32}
            className="size-8 rounded-full"
          />
        )}
        {row.original.icon && (
          <span className="text-xl">{row.original.icon}</span>
        )}
        <Typography className="capitalize">
          {row.original.name}
        </Typography>
      </div>
    ),
  },
  {
    header: "slug",
    cell: ({ row }) => (
      <Typography className="text-muted-foreground">
        {row.original.slug}
      </Typography>
    ),
  },
  {
    header: "description",
    cell: ({ row }) => (
      <Typography className="max-w-[300px] truncate">
        {row.original.description || "No description"}
      </Typography>
    ),
  },
  {
    header: "display order",
    cell: ({ row }) => row.original.display_order,
  },
  {
    header: "active",
    cell: ({ row }) => (
      <Switch
        checked={row.original.is_active}
        onCheckedChange={handleSwitchChange}
        aria-label="Toggle category status"
      />
    ),
  },
  {
    header: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Sheet>
          <Tooltip>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                >
                  <PenSquare className="size-4" />
                </Button>
              </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent>Edit category</TooltipContent>
          </Tooltip>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit category</SheetTitle>
              <SheetDescription>
                Make changes to the category here. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={row.original.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={row.original.description || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  value={row.original.display_order}
                  type="number"
                />
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                >
                  <Trash2 className="size-4" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Delete category</TooltipContent>
          </Tooltip>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                category and remove the data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  },
];

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "",
    cell: <Checkbox disabled />,
  },
  {
    header: "category",
    cell: (
      <div className="flex gap-2 items-center">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    ),
  },
  {
    header: "slug",
    cell: <Skeleton className="h-4 w-[100px]" />,
  },
  {
    header: "description",
    cell: <Skeleton className="h-4 w-[300px]" />,
  },
  {
    header: "display order",
    cell: <Skeleton className="h-4 w-[80px]" />,
  },
  {
    header: "active",
    cell: <Skeleton className="h-4 w-[100px]" />,
  },
  {
    header: "actions",
    cell: (
      <div className="flex items-center gap-2">
        <Skeleton className="size-8" />
        <Skeleton className="size-8" />
      </div>
    ),
  },
];
