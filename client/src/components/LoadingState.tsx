import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingState() {
  return (
    <Card className="shadow rounded-lg p-6 mb-8">
      <CardContent className="p-0">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="animate-spin h-12 w-12 text-primary-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Fetching product details...</h3>
          <p className="text-sm text-gray-500">This may take a few moments.</p>
        </div>
      </CardContent>
    </Card>
  );
}
