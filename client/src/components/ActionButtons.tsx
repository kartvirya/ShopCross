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
    doc.setFontSize(18);
    doc.setTextColor(33, 99, 232);
    doc.text("NepalShippr - Cost Breakdown", 15, 20);
    
    // Product details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Product Details", 15, 30);
    
    doc.setFontSize(11);
    doc.text(`Product: ${product.title}`, 15, 40);
    doc.text(`Original Price: ${product.originalPrice}`, 15, 48);
    if (product.category) doc.text(`Category: ${product.category}`, 15, 56);
    if (product.weight) doc.text(`Weight: ${product.weight}`, 15, 64);
    if (product.seller) doc.text(`Seller: ${product.seller}`, 15, 72);
    doc.text(`Website: ${product.website}`, 15, 80);
    
    // Cost breakdown
    doc.setFontSize(14);
    doc.text("Cost Breakdown", 15, 95);
    
    doc.setFontSize(11);
    doc.text(`Product Price (INR): ${costBreakdown.productPriceINR}`, 15, 105);
    doc.text(`Exchange Rate: ${costBreakdown.exchangeRate.toFixed(2)}`, 15, 113);
    doc.text(`Product Price (NPR): ${costBreakdown.productPriceNPR}`, 15, 121);
    doc.text(`Customs Duty (30%): ${costBreakdown.customsDuty}`, 15, 129);
    doc.text(`Shipping Cost: ${costBreakdown.shippingCost}`, 15, 137);
    
    doc.setFontSize(13);
    doc.setTextColor(33, 99, 232);
    doc.text(`Total Cost (NPR): ${costBreakdown.totalCostNPR}`, 15, 150);
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Disclaimer: These calculations are estimates. Actual costs may vary.", 15, 170);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 15, 175);
    
    doc.save("product-cost-breakdown.pdf");
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <Button 
        onClick={handleCalculateAnother} 
        variant="outline" 
        size="sm"
        className="border-gray-300 text-gray-700"
      >
        <ArrowLeft className="mr-1 h-4 w-4 text-gray-500" />
        Calculate Another
      </Button>
      
      <Button 
        onClick={generatePDF} 
        size="sm"
        className="bg-primary-600 hover:bg-primary-700"
      >
        <Download className="mr-1 h-4 w-4" />
        Save PDF
      </Button>
    </div>
  );
}
