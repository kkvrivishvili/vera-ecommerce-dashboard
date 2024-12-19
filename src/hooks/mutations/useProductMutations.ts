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
    onSuccess: () => {
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
    onSuccess: () => {
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
    onSuccess: () => {
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
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}
