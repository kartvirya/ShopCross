import { CheckCircle, ShoppingBag, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <ShoppingBag className="h-4 w-4 text-primary-600 mr-1.5" />
          <h2 className="text-sm font-semibold">Product Details</h2>
          <Badge variant="outline" className="ml-auto text-xs bg-gray-100 text-gray-700">
            {product.website}
          </Badge>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-1/4 flex-shrink-0">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-auto rounded object-cover max-h-36" 
              />
            ) : (
              <div className="w-full h-36 bg-gray-100 rounded flex items-center justify-center">
                <Tag className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="sm:w-3/4">
            <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
            
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-1">
              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="text-sm font-semibold">{product.originalPrice}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm">{product.category || "General"}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-sm">{product.weight || "0.5 kg"}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Seller</p>
                <p className="text-sm truncate">{product.seller || product.website}</p>
              </div>
            </div>
            
            <div className="mt-2 pt-1.5 border-t border-gray-100">
              <div className="flex items-center">
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                <span className="ml-1 text-xs text-gray-600">Eligible for shipping to Nepal</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
