import { Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDetails } from "@shared/schema";
import jsPDF from "jspdf";

interface ActionButtonsProps {
  productDetails: ProductDetails;
  handleCalculateAnother: () => void;
}

export default function ActionButtons({ productDetails, handleCalculateAnother }: ActionButtonsProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const { product, costBreakdown } = productDetails;
    
    // Document title
    doc.setFontSize(20);
    doc.setTextColor(33, 99, 232);
    doc.text("NepalShippr - Cost Breakdown", 20, 20);
    
    // Product details
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Product Details", 20, 35);
    
    doc.setFontSize(12);
    doc.text(`Product: ${product.title}`, 20, 45);
    doc.text(`Original Price: ${product.originalPrice}`, 20, 55);
    if (product.category) doc.text(`Category: ${product.category}`, 20, 65);
    if (product.weight) doc.text(`Weight: ${product.weight}`, 20, 75);
    if (product.seller) doc.text(`Seller: ${product.seller}`, 20, 85);
    
    // Cost breakdown
    doc.setFontSize(16);
    doc.text("Cost Breakdown", 20, 100);
    
    doc.setFontSize(12);
    doc.text(`Product Price (INR): ${costBreakdown.productPriceINR}`, 20, 110);
    doc.text(`Exchange Rate: ${costBreakdown.exchangeRate.toFixed(2)}`, 20, 120);
    doc.text(`Product Price (NPR): ${costBreakdown.productPriceNPR}`, 20, 130);
    doc.text(`Customs Duty (30%): ${costBreakdown.customsDuty}`, 20, 140);
    doc.text(`Shipping Cost: ${costBreakdown.shippingCost}`, 20, 150);
    
    doc.setFontSize(14);
    doc.setTextColor(33, 99, 232);
    doc.text(`Total Cost (NPR): ${costBreakdown.totalCostNPR}`, 20, 165);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Disclaimer: These calculations are estimates. Actual costs may vary.", 20, 180);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 185);
    
    doc.save("nepalshippr-cost-breakdown.pdf");
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
      <Button onClick={generatePDF} className="bg-primary-600 hover:bg-primary-700">
        <Download className="-ml-1 mr-2 h-5 w-5" />
        Save as PDF
      </Button>
      
      <Button variant="outline" onClick={handleCalculateAnother} className="border-gray-300 text-gray-700">
        <ArrowLeft className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
        Calculate Another Product
      </Button>
    </div>
  );
}
