import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, deleteProduct, type CreateProductData } from "@/data/products";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";

export function useProductMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (product: CreateProductData) => {
      try {
        const result = await createProduct(product);
        return result;
      } catch (error: any) {
        console.error('Error creating product:', error);
        throw new Error(error.message || 'Failed to create product');
      }
    },
    onSuccess: (newProduct) => {
      // Actualizar el caché optimistamente
      queryClient.setQueryData(
        ["products"],
        (old: any) => {
          if (!old) return { items: [newProduct], meta: { total: 1, page: 1, pages: 1, per_page: 10 } };
          return {
            ...old,
            items: [newProduct, ...old.items],
            meta: { ...old.meta, total: old.meta.total + 1 }
          };
        }
      );
      // Invalidar todas las queries de productos para asegurar consistencia
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Error creating product: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreateProductData> }) => {
      try {
        const result = await updateProduct(id, updates);
        return result;
      } catch (error: any) {
        console.error('Error updating product:', error);
        throw new Error(error.message || 'Failed to update product');
      }
    },
    onSuccess: (updatedProduct, { id }) => {
      // Actualizar el caché optimistamente
      queryClient.setQueryData(
        ["products"],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item: Product) =>
              item.id === id ? { ...item, ...updatedProduct } : item
            ),
          };
        }
      );
      // Invalidar todas las queries de productos para asegurar consistencia
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Error updating product: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const result = await deleteProduct(id);
        return result;
      } catch (error: any) {
        console.error('Error deleting product:', error);
        throw new Error(error.message || 'Failed to delete product');
      }
    },
    onSuccess: (_, id) => {
      // Actualizar el caché optimistamente
      queryClient.setQueryData(
        ["products"],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.filter((item: Product) => item.id !== id),
            meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) }
          };
        }
      );
      // Invalidar todas las queries de productos para asegurar consistencia
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Error deleting product: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
