import { CostBreakdown } from "@shared/schema";

// Constants for calculation
const CUSTOMS_DUTY_RATE = 0.30; // 30% customs duty
const BASE_SHIPPING_COST = 1500; // Base shipping cost in NPR
const WEIGHT_SHIPPING_MULTIPLIER = 500; // Additional cost per kg

// Calculate total cost including currency conversion, customs duty, and shipping
export function calculateTotalCost(priceInINR: number, exchangeRate: number): CostBreakdown {
  // Convert price to NPR
  const priceInNPR = priceInINR * exchangeRate;
  
  // Calculate customs duty (30% of product price in NPR)
  const customsDuty = priceInNPR * CUSTOMS_DUTY_RATE;
  
  // Calculate shipping cost based on weight (if provided) or default to base cost
  const shippingCost = BASE_SHIPPING_COST;
  
  // Calculate total cost
  const totalCost = priceInNPR + customsDuty + shippingCost;
  
  // Format amounts for display
  return {
    productPriceINR: `₹ ${priceInINR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
    exchangeRate: exchangeRate,
    productPriceNPR: `NPR ${priceInNPR.toLocaleString('en-NP', { maximumFractionDigits: 2 })}`,
    customsDuty: `NPR ${customsDuty.toLocaleString('en-NP', { maximumFractionDigits: 2 })}`,
    shippingCost: `NPR ${shippingCost.toLocaleString('en-NP', { maximumFractionDigits: 2 })}`,
    totalCostNPR: `NPR ${totalCost.toLocaleString('en-NP', { maximumFractionDigits: 2 })}`
  };
}

// Calculate shipping cost based on weight
export function calculateShippingCost(weightInKg: number = 0.5): number {
  if (!weightInKg || weightInKg <= 0) {
    weightInKg = 0.5; // Default to 0.5kg if no weight specified
  }
  
  // Base cost + additional cost per kg
  return BASE_SHIPPING_COST + (weightInKg * WEIGHT_SHIPPING_MULTIPLIER);
}
