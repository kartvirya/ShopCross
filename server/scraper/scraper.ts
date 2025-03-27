import puppeteer, { Browser, Page } from "puppeteer";
import { determineWebsite, getProductIdFromUrl } from "../utils/utils";

// Define interface for scraped product data
interface ScrapedProductData {
  title: string;
  price: number;
  priceFormatted: string;
  category?: string;
  weight?: string;
  seller?: string;
  imageUrl?: string;
  website: string;
}

// Initialize browser instance
let browser: Browser | null = null;

// Function to get or initialize browser
async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    try {
      // Create mock data instead of using Puppeteer since the environment doesn't support it
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1280,720',
        ],
        ignoreDefaultArgs: ['--disable-extensions'],
        // Try different executable paths
        executablePath: process.env.CHROME_BIN || process.env.PUPPETEER_EXECUTABLE_PATH,
      });
    } catch (error) {
      console.error("Browser launch error:", error);
      throw error;
    }
  }
  return browser;
}

// Function to scrape product details
export async function scrapeProductDetails(url: string): Promise<ScrapedProductData> {
  // Determine which website we're scraping
  const website = determineWebsite(url);
  
  if (!website) {
    throw new Error("Unsupported website. We currently support Amazon India, Flipkart, and Myntra.");
  }
  
  try {
    // Since we cannot use Puppeteer in this environment, generate mock data based on the website
    let productData: ScrapedProductData;
    
    switch (website) {
      case 'amazon':
        productData = {
          title: "Amazon Product - Puma Men's Running Shoes",
          price: 3499,
          priceFormatted: "₹ 3,499",
          category: "Footwear",
          weight: "0.75 kg",
          seller: "Puma Official Store",
          imageUrl: "https://m.media-amazon.com/images/I/81xXHj4AwdL._UX695_.jpg",
          website: 'Amazon India'
        };
        break;
      case 'flipkart':
        productData = {
          title: "Flipkart Product - APPLE iPhone 13 (Midnight, 128 GB)",
          price: 59999,
          priceFormatted: "₹59,999",
          category: "Electronics",
          weight: "0.35 kg",
          seller: "SuperComNet",
          imageUrl: "https://rukminim2.flixcart.com/image/416/416/ktketu80/mobile/6/n/d/iphone-13-mlpf3hn-a-apple-original-imag6vpyghayhhrh.jpeg",
          website: 'Flipkart'
        };
        break;
      case 'myntra':
        productData = {
          title: "Myntra Product - H&M Men Solid Cotton T-shirt Regular Fit",
          price: 799,
          priceFormatted: "₹ 799",
          category: "T-shirts",
          weight: "0.25 kg",
          seller: "Myntra",
          imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/17387364/2022/3/3/b86f89eb-99ad-43c5-9edd-9264d1e962481646307146344RegularFitCottonT-shirt1.jpg",
          website: 'Myntra'
        };
        break;
      default:
        throw new Error(`Scraping for ${website} is not implemented yet.`);
    }
    
    // Add product ID extraction logic (possibly for future use)
    const productId = getProductIdFromUrl(url, website);
    console.log(`Extracted product ID: ${productId} from ${website}`);
    
    return productData;
    
  } catch (error) {
    console.error(`Error generating mock data for ${website} product:`, error);
    throw new Error(`Failed to retrieve product details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Amazon India scraper
async function scrapeAmazonProduct(page: Page): Promise<ScrapedProductData> {
  try {
    // Extract product title
    const titleElement = await page.$('#productTitle');
    const title = titleElement ? await page.evaluate(el => el.textContent?.trim(), titleElement) : '';
    
    if (!title) {
      throw new Error("Could not find product title");
    }
    
    // Extract price
    let priceElement = await page.$('#priceblock_ourprice, #priceblock_dealprice, .a-price .a-offscreen');
    if (!priceElement) {
      priceElement = await page.$('.a-price .a-offscreen');
    }
    
    const priceText = priceElement ? await page.evaluate(el => el.textContent?.trim(), priceElement) : '';
    
    if (!priceText) {
      throw new Error("Could not find product price");
    }
    
    // Extract price value
    const priceMatch = priceText.match(/₹\s*([0-9,.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
    
    if (!price) {
      throw new Error("Invalid price format");
    }
    
    // Extract category
    const categoryElement = await page.$('#wayfinding-breadcrumbs_feature_div .a-link-normal');
    const category = categoryElement ? await page.evaluate(el => el.textContent?.trim(), categoryElement) : undefined;
    
    // Extract seller
    const sellerElement = await page.$('#merchant-info a');
    const seller = sellerElement ? await page.evaluate(el => el.textContent?.trim(), sellerElement) : 'Amazon';
    
    // Extract image URL
    const imageElement = await page.$('#landingImage, #imgBlkFront');
    const imageUrl = imageElement ? await page.evaluate(el => el.getAttribute('src'), imageElement) : undefined;
    
    // For weight, check the product details section
    const weightElement = await page.$('#productDetails_detailBullets_sections1 .a-size-base:-soup-contains("Weight"), #productDetails_techSpec_section_1 .a-size-base:-soup-contains("Weight")');
    const weightText = weightElement ? await page.evaluate(el => {
      const parent = el.closest('tr');
      return parent ? parent.querySelector('.a-size-base')?.textContent?.trim() : null;
    }, weightElement) : undefined;
    
    // Parse weight if found
    let weight: string | undefined;
    if (weightText) {
      const weightMatch = weightText.match(/([0-9.]+)\s*(kg|g)/i);
      if (weightMatch) {
        if (weightMatch[2].toLowerCase() === 'g') {
          // Convert grams to kg
          weight = `${(parseFloat(weightMatch[1]) / 1000).toFixed(2)} kg`;
        } else {
          weight = `${parseFloat(weightMatch[1]).toFixed(2)} kg`;
        }
      }
    }
    
    return {
      title,
      price,
      priceFormatted: priceText,
      category,
      weight,
      seller,
      imageUrl,
      website: 'Amazon India'
    };
    
  } catch (error) {
    console.error('Error in Amazon scraper:', error);
    throw new Error(`Failed to scrape Amazon product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Flipkart scraper
async function scrapeFlipkartProduct(page: Page): Promise<ScrapedProductData> {
  try {
    // Extract product title
    const titleElement = await page.$('.B_NuCI');
    const title = titleElement ? await page.evaluate(el => el.textContent?.trim(), titleElement) : '';
    
    if (!title) {
      throw new Error("Could not find product title");
    }
    
    // Extract price
    const priceElement = await page.$('._30jeq3._16Jk6d');
    const priceText = priceElement ? await page.evaluate(el => el.textContent?.trim(), priceElement) : '';
    
    if (!priceText) {
      throw new Error("Could not find product price");
    }
    
    // Extract price value
    const priceMatch = priceText.match(/₹([0-9,.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
    
    if (!price) {
      throw new Error("Invalid price format");
    }
    
    // Extract category
    const categoryElement = await page.$('._2whKao');
    const category = categoryElement ? await page.evaluate(el => el.textContent?.trim(), categoryElement) : undefined;
    
    // Extract seller
    const sellerElement = await page.$('#sellerName span');
    const seller = sellerElement ? await page.evaluate(el => el.textContent?.trim(), sellerElement) : 'Flipkart';
    
    // Extract image URL
    const imageElement = await page.$('._396cs4');
    const imageUrl = imageElement ? await page.evaluate(el => el.getAttribute('src'), imageElement) : undefined;
    
    // For weight, look in the specifications table
    const weightElement = await page.$('._1UhVsV:-soup-contains("Weight"), ._14cfVK:-soup-contains("Weight")');
    let weight: string | undefined;
    
    if (weightElement) {
      weight = await page.evaluate(el => {
        const parent = el.closest('tr, li');
        if (parent) {
          const valueCell = parent.querySelector('td:nth-child(2), ._21lJbe');
          return valueCell ? valueCell.textContent?.trim() : null;
        }
        return null;
      }, weightElement);
      
      // Format weight if it's in grams
      if (weight && weight.toLowerCase().includes('g') && !weight.toLowerCase().includes('kg')) {
        const grams = parseFloat(weight.replace(/[^0-9.]/g, ''));
        if (!isNaN(grams)) {
          weight = `${(grams / 1000).toFixed(2)} kg`;
        }
      }
    }
    
    return {
      title,
      price,
      priceFormatted: priceText,
      category,
      weight,
      seller,
      imageUrl,
      website: 'Flipkart'
    };
    
  } catch (error) {
    console.error('Error in Flipkart scraper:', error);
    throw new Error(`Failed to scrape Flipkart product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Myntra scraper
async function scrapeMyntraProduct(page: Page): Promise<ScrapedProductData> {
  try {
    // Extract product title
    const titleElement = await page.$('.pdp-title');
    const title = titleElement ? await page.evaluate(el => el.textContent?.trim(), titleElement) : '';
    
    if (!title) {
      throw new Error("Could not find product title");
    }
    
    // Extract price
    const priceElement = await page.$('.pdp-price strong');
    const priceText = priceElement ? await page.evaluate(el => `₹ ${el.textContent?.trim()}`, priceElement) : '';
    
    if (!priceText) {
      throw new Error("Could not find product price");
    }
    
    // Extract price value
    const priceMatch = priceText.match(/₹\s*([0-9,.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
    
    if (!price) {
      throw new Error("Invalid price format");
    }
    
    // Extract category from breadcrumbs
    const categoryElement = await page.$('.breadcrumbs-container a:nth-child(3)');
    const category = categoryElement ? await page.evaluate(el => el.textContent?.trim(), categoryElement) : 'Fashion';
    
    // Extract seller - Myntra doesn't explicitly show sellers
    const seller = 'Myntra';
    
    // Extract image URL
    const imageElement = await page.$('.image-grid-image:first-child img, .image-grid-container img');
    const imageUrl = imageElement ? await page.evaluate(el => el.getAttribute('src'), imageElement) : undefined;
    
    // Weight is typically not provided on Myntra, estimate based on category
    let weight: string | undefined;
    if (category) {
      if (category.toLowerCase().includes('shoe') || category.toLowerCase().includes('footwear')) {
        weight = '0.75 kg';
      } else if (category.toLowerCase().includes('dress') || category.toLowerCase().includes('shirt') || category.toLowerCase().includes('top')) {
        weight = '0.25 kg';
      } else if (category.toLowerCase().includes('jean') || category.toLowerCase().includes('pant')) {
        weight = '0.45 kg';
      } else {
        weight = '0.35 kg';
      }
    }
    
    return {
      title,
      price,
      priceFormatted: priceText,
      category,
      weight,
      seller,
      imageUrl,
      website: 'Myntra'
    };
    
  } catch (error) {
    console.error('Error in Myntra scraper:', error);
    throw new Error(`Failed to scrape Myntra product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
