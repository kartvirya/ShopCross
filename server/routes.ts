import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scrapeProductDetails, type ScrapedProductData } from "./scraper/scraper";
import { getCurrencyRate } from "./services/currency";
import { calculateTotalCost } from "./services/calculator";
import { urlSchema, ProductDetails } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Scrape product API endpoint
  app.post("/api/scrape", async (req: Request, res: Response) => {
    try {
      // Validate URL
      const { url } = urlSchema.parse(req.body);
      console.log(`Processing scrape request for URL: ${url}`);
      
      // Check cache first
      const cachedResult = await storage.getProductByUrl(url);
      if (cachedResult) {
        console.log(`Returning cached result for ${url}`);
        return res.json(cachedResult);
      }
      
      // Set a timeout for the scraping operation
      const timeout = 15000; // 15 seconds timeout (increased from 12)
      
      // Create a promise that will be rejected after the timeout
      const timeoutPromise: Promise<never> = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Scraping timed out after 15 seconds')), timeout);
      });
      
      // Race the scraping against the timeout
      let productData: ScrapedProductData;
      try {
        productData = await Promise.race([
          scrapeProductDetails(url),
          timeoutPromise
        ]);
        console.log(`Successfully scraped data for ${url}`);
      } catch (scrapeError) {
        console.error(`Scraping failed for ${url}:`, scrapeError);
        
        // Provide more specific error messages based on error type
        if (scrapeError instanceof Error) {
          const errorMessage = scrapeError.message;
          
          if (errorMessage.includes('timed out')) {
            return res.status(504).json({ 
              message: "The product page took too long to process. This might be due to a complex page or the website blocking our request. Please try again later or with a different product.",
              error: "Scraping timed out",
              statusCode: 504
            });
          } else if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('ECONNREFUSED')) {
            return res.status(502).json({
              message: "Unable to reach the e-commerce website. The site might be experiencing issues.",
              error: "Connection failed",
              statusCode: 502
            });
          } else if (errorMessage.includes('find product') || errorMessage.includes('Could not find')) {
            return res.status(404).json({
              message: "We couldn't extract the product details from the provided URL. The product page structure might have changed or the product is no longer available.",
              error: "Product information not found",
              statusCode: 404
            });
          } else if (errorMessage.includes('browser') || errorMessage.includes('puppeteer') || errorMessage.includes('libgobject') || errorMessage.includes('chrome')) {
            console.log("Browser automation error detected, falling back to HTML parsing only mode");
            // Continue with the process - the scraper will use its internal fallback mechanism
            productData = await scrapeProductDetails(url);
          } else if (errorMessage.includes('launch') || errorMessage.includes('shared libraries')) {
            console.log("Browser launch error detected, falling back to HTML parsing only mode");
            // Continue with the process - the scraper will use its internal fallback mechanism
            productData = await scrapeProductDetails(url);
          } else {
            // Generic error handler for other scraping issues
            console.error("Unhandled scraper error:", errorMessage);
            return res.status(500).json({
              message: "We encountered an issue processing this product. Our team has been notified. Please try again later or with a different product URL.",
              error: "Processing error",
              statusCode: 500
            });
          }
        } else {
          // Handle non-Error objects
          console.error("Unknown scraper error type:", scrapeError);
          return res.status(500).json({
            message: "An unexpected error occurred. Please try again later.",
            error: "Unknown error",
            statusCode: 500
          });
        }
      }
      
      // Get latest exchange rate
      let exchangeRate: number;
      try {
        exchangeRate = await getCurrencyRate();
        console.log(`Current exchange rate: ${exchangeRate}`);
      } catch (rateError) {
        console.error("Failed to get exchange rate:", rateError);
        // Use fallback rate if API fails (1.60 is a reasonable NPR/INR rate)
        exchangeRate = 1.60;
        console.log(`Using fallback exchange rate: ${exchangeRate}`);
      }
      
      // Calculate costs
      const costBreakdown = calculateTotalCost(productData.price, exchangeRate);
      
      // Format product details response
      const productDetails: ProductDetails = {
        product: {
          title: productData.title,
          originalPrice: productData.priceFormatted,
          category: productData.category,
          weight: productData.weight,
          seller: productData.seller,
          imageUrl: productData.imageUrl,
          website: productData.website,
        },
        costBreakdown,
      };
      
      // Save to cache
      try {
        await storage.cacheProductDetails(url, productDetails);
        console.log(`Cached product details for ${url}`);
      } catch (cacheError) {
        // Log but don't fail if caching fails
        console.error(`Failed to cache product details for ${url}:`, cacheError);
      }
      
      return res.json(productDetails);
    } catch (error) {
      console.error("Error processing scrape request:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message || "Invalid URL format",
          error: "Invalid input",
          statusCode: 400
        });
      }
      
      // General error handler
      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to fetch product details";
      
      return res.status(500).json({ 
        message: errorMessage,
        error: "Processing failed",
        statusCode: 500
      });
    }
  });

  // Exchange rate API endpoint
  app.get("/api/exchange-rate", async (_req: Request, res: Response) => {
    try {
      const rate = await getCurrencyRate();
      console.log(`Successfully retrieved exchange rate: ${rate}`);
      return res.json({ 
        rate,
        success: true,
        source: "API",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      
      // Use fallback rate if API fails
      const fallbackRate = 1.60;
      console.log(`Using fallback exchange rate: ${fallbackRate}`);
      
      return res.status(200).json({ 
        rate: fallbackRate,
        success: true,
        source: "Fallback",
        timestamp: new Date().toISOString(),
        message: "Using fallback exchange rate due to API issues",
        note: "This is an estimated rate and may not reflect current market conditions"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
