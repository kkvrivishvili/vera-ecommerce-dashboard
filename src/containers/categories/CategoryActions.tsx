"use client";

import { Upload, Download, PenSquare, Plus } from "lucide-react";
import React from "react";

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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCategoryMutations } from "@/hooks/mutations/useCategoryMutations";
import CreateCategory from "./create-category";

export default function CategoryActions() {
  const [open, setOpen] = React.useState(false);
  const { deleteCategory, isLoading } = useCategoryMutations();

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Card className="mb-5">
      <form className="flex flex-col xl:flex-row xl:justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <Upload className="mr-2 size-4" /> Export
          </Button>

          <Button variant="outline">
            <Download className="mr-2 size-4" /> Import
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="secondary"
            size="lg"
            className="sm:flex-grow xl:flex-grow-0"
          >
            <PenSquare className="mr-2 size-4" /> Bulk Action
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="default"
                size="lg"
                className="sm:flex-grow xl:flex-grow-0"
              >
                <Plus className="mr-2 size-4" /> Add Category
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-2xl">
              <SheetHeader>
                <SheetTitle>Create Category</SheetTitle>
                <SheetDescription>
                  Add a new category to your store. Fill in the details below.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <CreateCategory onSuccess={handleSuccess} onClose={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </form>
    </Card>
  );
}
