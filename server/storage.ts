import { 
  type ProductDetails, 
  type CacheEntry
} from "@shared/schema";

export interface IStorage {
  getProductByUrl(url: string): Promise<ProductDetails | undefined>;
  cacheProductDetails(url: string, details: ProductDetails): Promise<void>;
}

export class MemStorage implements IStorage {
  private cache: Map<string, CacheEntry>;
  private cacheExpirationTime: number = 60 * 60 * 1000; // 1 hour in milliseconds

  constructor() {
    this.cache = new Map();
  }

  async getProductByUrl(url: string): Promise<ProductDetails | undefined> {
    const cacheEntry = this.cache.get(url);
    
    if (!cacheEntry) {
      return undefined;
    }
    
    // Check if cache has expired
    const now = Date.now();
    if (now - cacheEntry.timestamp > this.cacheExpirationTime) {
      this.cache.delete(url);
      return undefined;
    }
    
    // Return cached product details
    return {
      product: {
        title: cacheEntry.product.title,
        originalPrice: cacheEntry.product.originalPrice.toString(),
        category: cacheEntry.product.category || "",
        weight: cacheEntry.product.weight ? `${cacheEntry.product.weight} kg` : undefined,
        seller: cacheEntry.product.seller || "",
        imageUrl: cacheEntry.product.imageUrl || "",
        website: cacheEntry.product.website,
      },
      costBreakdown: cacheEntry.costBreakdown,
    };
  }

  async cacheProductDetails(url: string, details: ProductDetails): Promise<void> {
    // Convert from ProductDetails format to cache entry format
    const cacheEntry: CacheEntry = {
      product: {
        id: 0, // Not used in memory storage
        url,
        title: details.product.title,
        originalPrice: parseFloat(details.product.originalPrice.replace(/[^0-9.]/g, '')),
        category: details.product.category || "",
        weight: details.product.weight ? parseFloat(details.product.weight.replace(/[^0-9.]/g, '')) : null,
        seller: details.product.seller || "",
        imageUrl: details.product.imageUrl || "",
        website: details.product.website,
        createdAt: new Date().toISOString(),
      },
      costBreakdown: details.costBreakdown,
      timestamp: Date.now(),
    };
    
    this.cache.set(url, cacheEntry);
  }
}

export const storage = new MemStorage();
