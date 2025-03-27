import { KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { urlSchema, type UrlRequest, type ProductDetails } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  // Handle Enter key press
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <div className="flex items-center mb-3">
        <LinkIcon className="h-4 w-4 text-primary-600 mr-1.5" />
        <h2 className="text-base font-semibold">Enter Product URL</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <FormControl>
                    <div className="relative w-full">
                      <Input 
                        placeholder="https://www.amazon.in/product-name/dp/B0xxxxx" 
                        {...field} 
                        className="pr-16 text-sm"
                        onKeyDown={handleKeyDown}
                      />
                      <Button 
                        type="submit" 
                        size="sm"
                        className="absolute right-0.5 top-0.5 h-[calc(100%-4px)] bg-primary-600 hover:bg-primary-700"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </FormControl>
                </div>
                <div className="flex justify-between items-center pt-1 px-0.5">
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs font-normal py-0 px-1.5 h-5">
                      Amazon.in
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-normal py-0 px-1.5 h-5">
                      Flipkart
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-normal py-0 px-1.5 h-5">
                      Myntra
                    </Badge>
                  </div>
                  <p className="text-xs text-blue-600">
                    Press Enter ↵
                  </p>
                </div>
                <FormMessage className="text-xs mt-1" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
