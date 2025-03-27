import { Zap, Calculator, DollarSign } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">1. Paste Product URL</h3>
          <p className="text-gray-500">Copy the link of any product from Indian e-commerce sites like Amazon India, Flipkart or Myntra.</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
            <Calculator className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">2. Get Product Details</h3>
          <p className="text-gray-500">Our system automatically extracts product information including price, category, and estimated weight.</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">3. See Total Cost</h3>
          <p className="text-gray-500">Get the final cost in Nepali Rupees including currency conversion, 30% customs duty, and shipping costs.</p>
        </div>
      </div>
    </div>
  );
}
