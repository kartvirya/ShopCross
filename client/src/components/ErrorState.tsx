import { AlertCircle, RefreshCw, HelpCircle, Link2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ErrorStateProps {
  errorMessage: string;
  handleTryAgain: () => void;
}

export default function ErrorState({ errorMessage, handleTryAgain }: ErrorStateProps) {
  // Determine which icon to show based on the error message
  const getIconForError = () => {
    if (errorMessage.includes("timeout") || errorMessage.includes("too long"))
      return <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />;
      
    if (errorMessage.includes("blocking") || errorMessage.includes("access"))
      return <Link2 className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />;
    
    return <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />;
  };
  
  // Determine title based on the error message
  const getErrorTitle = () => {
    if (errorMessage.includes("timeout") || errorMessage.includes("too long"))
      return "Request timed out";
      
    if (errorMessage.includes("blocking") || errorMessage.includes("access"))
      return "Access restricted";
      
    if (errorMessage.includes("product") || errorMessage.includes("details") || errorMessage.includes("extract"))
      return "Product details unavailable";
      
    return "Error retrieving product details";
  };
  
  // Additional tips based on error type
  const getErrorTip = () => {
    if (errorMessage.includes("timeout") || errorMessage.includes("too long"))
      return "Try again later when the website might be less busy";
      
    if (errorMessage.includes("blocking") || errorMessage.includes("access"))
      return "Try a product from a different website like Amazon.in or Flipkart";
      
    if (errorMessage.includes("product") || errorMessage.includes("details") || errorMessage.includes("extract"))
      return "Copy the URL directly from the product page";
      
    return "Make sure you're using a link from a supported website";
  };

  return (
    <Card className="shadow rounded-lg p-4 mb-4 border-red-200 bg-red-50/50">
      <CardContent className="p-0">
        <div className="flex items-start space-x-3">
          {getIconForError()}
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <h3 className="text-sm font-medium text-red-800">{getErrorTitle()}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-red-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">{getErrorTip()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-red-700 mb-3">
              {errorMessage || "We couldn't fetch details from this URL. The site might be blocking our access or the URL could be invalid."}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-700 border-red-200 hover:bg-red-100"
                onClick={handleTryAgain}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Try Again
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-100 hover:text-red-700"
                onClick={() => window.location.reload()}
              >
                <ArrowRight className="h-3.5 w-3.5 mr-1" />
                Enter New URL
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
