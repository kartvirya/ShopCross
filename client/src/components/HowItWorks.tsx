import { Zap, Calculator, DollarSign, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorks() {
  return (
    <div className="mt-6">
      <div className="flex items-center mb-3">
        <Info className="h-4 w-4 text-primary-600 mr-1.5" />
        <h2 className="text-base font-semibold text-gray-900">How It Works</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mr-2 flex-shrink-0">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">1. Paste Product URL</h3>
                <p className="text-xs text-gray-500 mt-0.5">Copy product link from Amazon India, Flipkart, or Myntra.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mr-2 flex-shrink-0">
                <Calculator className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">2. Get Product Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">Our system extracts product information and price.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mr-2 flex-shrink-0">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">3. See Total Cost</h3>
                <p className="text-xs text-gray-500 mt-0.5">Get final cost in NPR with customs duty and shipping.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
