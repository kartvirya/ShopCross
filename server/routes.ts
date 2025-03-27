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
      
      // Check cache first
      const cachedResult = await storage.getProductByUrl(url);
      if (cachedResult) {
        return res.json(cachedResult);
      }
      
      // Set a timeout for the scraping operation
      const timeout = 12000; // 12 seconds timeout
      
      // Create a promise that will be rejected after the timeout
      const timeoutPromise: Promise<never> = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Scraping timed out after 12 seconds')), timeout);
      });
      
      // Race the scraping against the timeout
      const productData: ScrapedProductData = await Promise.race([
        scrapeProductDetails(url),
        timeoutPromise
      ]);
      
      // Get latest exchange rate
      const exchangeRate = await getCurrencyRate();
      
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
      await storage.cacheProductDetails(url, productDetails);
      
      return res.json(productDetails);
    } catch (error) {
      console.error("Error scraping product:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message || "Invalid URL format"
        });
      }
      
      // Handle timeout errors specially
      const errorMessage = error instanceof Error
        ? (error.message.includes('timed out')
            ? "The website took too long to respond. This may be due to website restrictions. Try a different product or website."
            : error.message)
        : "Failed to fetch product details";
      
      return res.status(500).json({ 
        message: errorMessage
      });
    }
  });

  // Exchange rate API endpoint
  app.get("/api/exchange-rate", async (_req: Request, res: Response) => {
    try {
      const rate = await getCurrencyRate();
      return res.json({ rate });
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch exchange rate"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
