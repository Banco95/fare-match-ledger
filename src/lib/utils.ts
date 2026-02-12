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
// 1. Configuration
export const COMMISSION_RATE = 0.06; // 6%
export const MAX_DEBT_LIMIT = 50.00; // R 50.00 Limit

// 2. Calculation: Run this when a trip ends
export const calculatePlatformFee = (tripAmount: number) => {
  return tripAmount * COMMISSION_RATE;
};

// 3. Validator: Run this before showing the driver the "Trip Feed"
export const isDriverEligible = (currentDebt: number) => {
  return currentDebt < MAX_DEBT_LIMIT;
};
