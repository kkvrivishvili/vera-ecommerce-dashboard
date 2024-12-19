import { Upload, Download, PenSquare, Trash2, Plus } from "lucide-react";
import React from "react";

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
import CreateProduct from "./create-product";

export default function ProductActions() {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Card className="mb-5">
      <form className="flex flex-col xl:flex-row xl:justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" type="button">
            <Upload className="mr-2 size-4" /> Export
          </Button>

          <Button variant="outline" type="button">
            <Download className="mr-2 size-4" /> Import
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="secondary"
            size="lg"
            type="button"
            className="sm:flex-grow xl:flex-grow-0"
          >
            <PenSquare className="mr-2 size-4" /> Bulk Action
          </Button>

          <Button
            variant="destructive"
            size="lg"
            type="button"
            className="sm:flex-grow xl:flex-grow-0"
          >
            <Trash2 className="mr-2 size-4" /> Delete
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="default"
                size="lg"
                type="button"
                className="sm:flex-grow xl:flex-grow-0"
              >
                <Plus className="mr-2 size-4" /> Add Product
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-2xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Create Product</SheetTitle>
                <SheetDescription>
                  Add a new product to your store. Fill in the details below.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <CreateProduct onSuccess={handleSuccess} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </form>
    </Card>
  );
}
