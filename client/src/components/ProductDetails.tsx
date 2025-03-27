import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProductProps {
  product: {
    title: string;
    originalPrice: string;
    category?: string;
    weight?: string;
    seller?: string;
    imageUrl?: string;
    website: string;
  };
}

export default function ProductDetails({ product }: ProductProps) {
  return (
    <Card className="shadow rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Product Details</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex-shrink-0">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-auto rounded-md object-cover" 
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          
          <div className="md:w-2/3">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{product.title}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Original Price</p>
                <p className="text-lg font-semibold">{product.originalPrice}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-base">{product.category || "Not specified"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Estimated Weight</p>
                <p className="text-base">{product.weight || "Not specified"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Seller</p>
                <p className="text-base">{product.seller || product.website}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="ml-2 text-sm text-gray-600">Eligible for shipping to Nepal</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
