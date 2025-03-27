import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
  errorMessage: string;
  handleTryAgain: () => void;
}

export default function ErrorState({ errorMessage, handleTryAgain }: ErrorStateProps) {
  return (
    <Card className="shadow rounded-lg p-6 mb-8">
      <CardContent className="p-0">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error retrieving product details</AlertTitle>
          <AlertDescription>
            {errorMessage || "We couldn't fetch details from this URL. The site might be blocking our access or the URL could be invalid. Please try another product or contact us for help."}
          </AlertDescription>
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="text-red-700 border-red-200 hover:bg-red-50"
              onClick={handleTryAgain}
            >
              Try Again
            </Button>
          </div>
        </Alert>
      </CardContent>
    </Card>
  );
}
