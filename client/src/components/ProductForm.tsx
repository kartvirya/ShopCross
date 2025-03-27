import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { urlSchema, type UrlRequest, type ProductDetails } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  setIsLoading: (loading: boolean) => void;
  setHasError: (hasError: boolean) => void;
  setErrorMessage: (message: string) => void;
  setProductDetails: (details: ProductDetails | null) => void;
}

export default function ProductForm({ 
  setIsLoading, 
  setHasError, 
  setErrorMessage, 
  setProductDetails 
}: ProductFormProps) {
  const { toast } = useToast();
  
  const form = useForm<UrlRequest>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (data: UrlRequest) => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage("");
      
      const response = await apiRequest("POST", "/api/scrape", data);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch product details");
      }
      
      const productDetails: ProductDetails = await response.json();
      setProductDetails(productDetails);
      
    } catch (error) {
      setHasError(true);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch product details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Enter Product URL</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Indian E-commerce Product Link</FormLabel>
                <div className="flex flex-col sm:flex-row gap-3">
                  <FormControl>
                    <Input 
                      placeholder="https://www.amazon.in/product-name/dp/B0xxxxx" 
                      {...field} 
                      className="flex-grow"
                    />
                  </FormControl>
                  <Button 
                    type="submit" 
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    Calculate Cost
                  </Button>
                </div>
                <p className="mt-2 text-sm text-gray-500">Works with Amazon India, Flipkart, Myntra, and more.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Amazon.in
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Flipkart
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Myntra
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Ajio
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Nykaa
            </span>
          </div>
        </form>
      </Form>
    </div>
  );
}
