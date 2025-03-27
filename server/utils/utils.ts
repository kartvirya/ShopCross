// Utility functions for the scraper and API

// Determine which website a URL belongs to
export function determineWebsite(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    if (hostname.includes('amazon.in') || hostname.includes('amazon.co.in')) {
      return 'amazon';
    } else if (hostname.includes('flipkart.com')) {
      return 'flipkart';
    } else if (hostname.includes('myntra.com')) {
      return 'myntra';
    } else if (hostname.includes('ajio.com')) {
      return 'ajio';
    } else if (hostname.includes('nykaa.com')) {
      return 'nykaa';
    }
    
    return null;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

// Extract product ID from URL
export function getProductIdFromUrl(url: string, website: string): string | null {
  try {
    const urlObj = new URL(url);
    
    switch (website) {
      case 'amazon':
        // Amazon product IDs are in the URL path as /dp/PRODUCTID or /gp/product/PRODUCTID
        const dpMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
        if (dpMatch) return dpMatch[1];
        
        const gpMatch = url.match(/\/gp\/product\/([A-Z0-9]{10})/);
        if (gpMatch) return gpMatch[1];
        
        return null;
        
      case 'flipkart':
        // Flipkart product IDs are usually in the URL as /p/PRODUCTID
        const flipkartMatch = url.match(/\/p\/([a-zA-Z0-9]{16})/);
        if (flipkartMatch) return flipkartMatch[1];
        
        // Alternative format with /pid in parameters
        const params = new URLSearchParams(urlObj.search);
        const pid = params.get('pid');
        if (pid) return pid;
        
        return null;
        
      case 'myntra':
        // Myntra product IDs are in the path after /buy/
        const myntraMatch = url.match(/\/([0-9]+)$/);
        return myntraMatch ? myntraMatch[1] : null;
        
      default:
        return null;
    }
  } catch (error) {
    console.error("Error extracting product ID:", error);
    return null;
  }
}

// Format currency for display
export function formatCurrency(amount: number, currency: string = 'NPR'): string {
  if (currency === 'INR') {
    return `₹ ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  } else {
    return `NPR ${amount.toLocaleString('en-NP', { maximumFractionDigits: 2 })}`;
  }
}
