import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type CostBreakdown as CostBreakdownType } from "@shared/schema";

interface CostBreakdownProps {
  costBreakdown: CostBreakdownType;
}

export default function CostBreakdown({ costBreakdown }: CostBreakdownProps) {
  return (
    <Card className="shadow rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Cost Breakdown</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Product Price (INR)</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{costBreakdown.productPriceINR}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <span>Exchange Rate</span>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">1 INR = {costBreakdown.exchangeRate.toFixed(2)} NPR</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{costBreakdown.exchangeRate.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Product Price (NPR)</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{costBreakdown.productPriceNPR}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Customs Duty (30%)</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{costBreakdown.customsDuty}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Shipping Cost</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{costBreakdown.shippingCost}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Total Cost (NPR)</td>
                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-primary-700 text-right">{costBreakdown.totalCostNPR}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  These calculations are estimates. Actual costs may vary based on current exchange rates and customs processes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
