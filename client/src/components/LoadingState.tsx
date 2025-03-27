import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingState() {
  return (
    <Card className="shadow rounded-lg p-4 mb-4">
      <CardContent className="p-0">
        <div className="flex flex-col items-center justify-center py-6">
          <Loader2 className="animate-spin h-10 w-10 text-primary-600 mb-3" />
          <h3 className="text-base font-medium text-gray-900">Fetching product details...</h3>
          <p className="text-xs text-gray-500">This may take a few moments</p>
        </div>
      </CardContent>
    </Card>
  );
}
