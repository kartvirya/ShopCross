import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  errorMessage: string;
  handleTryAgain: () => void;
}

export default function ErrorState({ errorMessage, handleTryAgain }: ErrorStateProps) {
  return (
    <Card className="shadow rounded-lg p-4 mb-4 border-red-200">
      <CardContent className="p-0">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 mb-1">Error retrieving product details</h3>
            <p className="text-xs text-red-700 mb-3">
              {errorMessage || "We couldn't fetch details from this URL. The site might be blocking our access or the URL could be invalid."}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-700 border-red-200 hover:bg-red-50"
              onClick={handleTryAgain}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Try Again
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
