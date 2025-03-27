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
    });
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
  
  const browser = await getBrowser();
  
  try {
    // Create a new page
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
    );
    
    // Set extra HTTP headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    });
    
    // Navigate to URL with timeout
    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    // Wait for a moment to ensure dynamic content loads
    await page.waitForTimeout(2000);
    
    // Extract product details based on the website
    let productData: ScrapedProductData;
    
    switch (website) {
      case 'amazon':
        productData = await scrapeAmazonProduct(page);
        break;
      case 'flipkart':
        productData = await scrapeFlipkartProduct(page);
        break;
      case 'myntra':
        productData = await scrapeMyntraProduct(page);
        break;
      default:
        throw new Error(`Scraping for ${website} is not implemented yet.`);
    }
    
    // Close the page
    await page.close();
    
    // Add website identifier
    productData.website = website;
    
    return productData;
    
  } catch (error) {
    console.error(`Error scraping ${website} product:`, error);
    throw new Error(`Failed to scrape product details: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
