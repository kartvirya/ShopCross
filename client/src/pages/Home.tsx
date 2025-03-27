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
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-primary-700 text-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold sm:text-4xl">
                <span className="block">Calculate the Real Cost of Indian Products</span>
                <span className="block text-primary-200">Delivered to Nepal</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-primary-100 sm:text-lg md:mt-5 md:max-w-3xl">
                Paste any product link from Amazon India, Flipkart, or Myntra and get the total cost including customs duty, shipping, and currency conversion.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
            <div className="space-y-8">
              <ProductDetails product={productDetails.product} />
              <CostBreakdown costBreakdown={productDetails.costBreakdown} />
              <ActionButtons 
                productDetails={productDetails}
                handleCalculateAnother={handleCalculateAnother} 
              />
            </div>
          )}

          <HowItWorks />
        </div>
      </main>
    </div>
  );
}
