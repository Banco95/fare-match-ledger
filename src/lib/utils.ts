import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** * Shadcn UI Helper 
 * Combines tailwind classes efficiently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** * RideoBid Pricing Logic
 */
export type PaymentMethod = 'CASH' | 'MOBILE_MONEY';

export interface MarketRates {
  uber: number;
  bolt: number;
  yango: number;
}

// Logic to calculate the "Fair Bid" range (Reference for Uber/Bolt/Yango)
export const calculateMarketAverage = (baseRates: MarketRates): number => {
  const values = Object.values(baseRates);
  return values.reduce((a, b) => a + b, 0) / values.length;
};

// Validator for ZAR currency bids (Ensures driver is paid fairly)
export const validateBid = (userBid: number, marketAvg: number) => {
  const minThreshold = marketAvg * 0.7; // Don't allow bids below 30% of market
  return userBid >= minThreshold;
};
