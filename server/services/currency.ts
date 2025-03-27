import nodeFetch from 'node-fetch';

// Cache for exchange rates to minimize API calls
interface RateCache {
  rate: number;
  timestamp: number;
}

let cachedRate: RateCache | null = null;
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

// Function to fetch INR to NPR exchange rate
export async function getCurrencyRate(): Promise<number> {
  // Check if we have a cached rate that's still valid
  if (cachedRate && (Date.now() - cachedRate.timestamp < CACHE_DURATION)) {
    return cachedRate.rate;
  }
  
  try {
    // Try fetching from API
    const rate = await fetchRateFromAPI();
    
    // Cache the fetched rate
    cachedRate = {
      rate,
      timestamp: Date.now()
    };
    
    return rate;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    
    // If API fails and we have an expired cache, use it as fallback
    if (cachedRate) {
      console.log("Using expired exchange rate as fallback");
      return cachedRate.rate;
    }
    
    // If everything fails, use a hardcoded fallback rate
    return 1.6; // Fallback exchange rate (1 INR = 1.6 NPR)
  }
}

// Function to fetch exchange rate from external API
async function fetchRateFromAPI(): Promise<number> {
  try {
    // Try multiple APIs for reliability
    const apis = [
      fetchFromExchangeRateAPI,
      fetchFromCurrencyConverterAPI,
      fetchFromOpenExchangeRates
    ];
    
    for (const apiCall of apis) {
      try {
        const rate = await apiCall();
        if (rate > 0) {
          return rate;
        }
      } catch (error) {
        console.error(`API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Continue to next API
      }
    }
    
    throw new Error("All exchange rate APIs failed");
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw error;
  }
}

// ExchangeRate-API method (free tier)
async function fetchFromExchangeRateAPI(): Promise<number> {
  const response = await nodeFetch('https://open.er-api.com/v6/latest/INR');
  
  if (!response.ok) {
    throw new Error(`ExchangeRate-API failed with status: ${response.status}`);
  }
  
  const data = await response.json() as any;
  
  if (data?.rates?.NPR) {
    return parseFloat(data.rates.NPR);
  }
  
  throw new Error("Could not find NPR rate in the response");
}

// Currency Converter API method
async function fetchFromCurrencyConverterAPI(): Promise<number> {
  const response = await nodeFetch('https://free.currconv.com/api/v7/convert?q=INR_NPR&compact=ultra&apiKey=cf1502de0cfe7bf3d5d4');
  
  if (!response.ok) {
    throw new Error(`Currency Converter API failed with status: ${response.status}`);
  }
  
  const data = await response.json() as any;
  
  if (data?.INR_NPR) {
    return parseFloat(data.INR_NPR);
  }
  
  throw new Error("Could not find INR_NPR rate in the response");
}

// Open Exchange Rates method
async function fetchFromOpenExchangeRates(): Promise<number> {
  const appId = process.env.OPEN_EXCHANGE_RATES_APP_ID || "open_exchange_rates_app_id";
  const response = await nodeFetch(`https://openexchangerates.org/api/latest.json?app_id=${appId}&base=USD`);
  
  if (!response.ok) {
    throw new Error(`Open Exchange Rates API failed with status: ${response.status}`);
  }
  
  const data = await response.json() as any;
  
  if (data?.rates?.INR && data?.rates?.NPR) {
    // Convert via USD as base
    const usdToInr = data.rates.INR;
    const usdToNpr = data.rates.NPR;
    
    // Calculate INR to NPR
    return usdToNpr / usdToInr;
  }
  
  throw new Error("Could not find required rates in the response");
}
