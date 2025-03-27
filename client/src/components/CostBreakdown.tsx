import { AlertTriangle, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type CostBreakdown as CostBreakdownType } from "@shared/schema";

interface CostBreakdownProps {
  costBreakdown: CostBreakdownType;
}

export default function CostBreakdown({ costBreakdown }: CostBreakdownProps) {
  return (
    <Card className="shadow rounded-lg overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Calculator className="h-5 w-5 text-primary-600 mr-2" />
          <h2 className="text-lg font-semibold">Cost Breakdown</h2>
          <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            1 INR = {costBreakdown.exchangeRate.toFixed(2)} NPR
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 text-gray-700">Product Price (INR)</td>
                <td className="py-2 text-right font-medium">{costBreakdown.productPriceINR}</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-700">Product Price (NPR)</td>
                <td className="py-2 text-right font-medium">{costBreakdown.productPriceNPR}</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-700">Customs Duty (30%)</td>
                <td className="py-2 text-right font-medium">{costBreakdown.customsDuty}</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-700">Shipping Cost</td>
                <td className="py-2 text-right font-medium">{costBreakdown.shippingCost}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2.5 font-semibold text-gray-900">Total Cost (NPR)</td>
                <td className="py-2.5 text-right text-base font-bold text-primary-700">{costBreakdown.totalCostNPR}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-3">
          <div className="bg-yellow-50 border-l-3 border-yellow-400 p-2 flex items-start">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 mr-1.5 flex-shrink-0" />
            <p className="text-xs text-yellow-700">
              These calculations are estimates. Actual costs may vary based on current exchange rates and customs processes.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
