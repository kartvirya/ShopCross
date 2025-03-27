import { useState } from "react";
import ProductForm from "@/components/ProductForm";
import ProductDetails from "@/components/ProductDetails";
import CostBreakdown from "@/components/CostBreakdown";
import HowItWorks from "@/components/HowItWorks";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ActionButtons from "@/components/ActionButtons";
import { ProductDetails as ProductDetailsType } from "@shared/schema";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [productDetails, setProductDetails] = useState<ProductDetailsType | null>(null);

  const resetStates = () => {
    setProductDetails(null);
    setHasError(false);
    setErrorMessage("");
  };

  const handleTryAgain = () => {
    resetStates();
  };

  const handleCalculateAnother = () => {
    resetStates();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white">
          <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
                <span className="block">Calculate the Real Cost of Indian Products</span>
                <span className="block text-primary-200 text-lg sm:text-xl">Delivered to Nepal</span>
              </h1>
              <p className="mt-2 max-w-md mx-auto text-primary-100 text-sm sm:text-base">
                Paste any product link from Amazon India, Flipkart, or Myntra and get the total cost including customs duty, shipping, and currency conversion.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <ProductForm 
            setIsLoading={setIsLoading}
            setHasError={setHasError}
            setErrorMessage={setErrorMessage}
            setProductDetails={setProductDetails}
          />

          {isLoading && <LoadingState />}
          
          {hasError && !isLoading && (
            <ErrorState 
              errorMessage={errorMessage} 
              handleTryAgain={handleTryAgain} 
            />
          )}
          
          {productDetails && !isLoading && !hasError && (
            <div className="space-y-3">
              <ProductDetails product={productDetails.product} />
              <CostBreakdown costBreakdown={productDetails.costBreakdown} />
              <ActionButtons 
                productDetails={productDetails}
                handleCalculateAnother={handleCalculateAnother} 
              />
            </div>
          )}

          <div className="mt-5">
            <HowItWorks />
          </div>
        </div>
      </main>
    </div>
  );
}
