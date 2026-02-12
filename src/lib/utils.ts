import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** * Shadcn UI Helper 
 * Combines tailwind classes efficiently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** * 🛡️ The Global Safety Gate
 * Checks if a driver is allowed to see new trips based on their debt and KYC status.
 * * @param debt - The current amount the driver owes (e.g., 55.00)
 * @param limit - The threshold set from Admin Panel (e.g., 50.00)
 * @param kycStatus - The driver's verification state ('NOT_STARTED', 'PENDING', 'VERIFIED')
 */
export const isDriverActive = (debt: number, limit: number, kycStatus: string) => {
  const isDebtFree = debt <= limit;
  const isVerified = kycStatus === 'VERIFIED';
  
  return {
    canWork: isDebtFree && isVerified,
    reason: !isVerified ? 'KYC_PENDING' : !isDebtFree ? 'DEBT_BLOCKED' : null
  };
};

/** * 📊 RideoBid Pricing & Market Logic
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

/**
 * 💰 Financial Calculations
 */

// Run this when a trip ends to calculate the 6% cut
export const calculatePlatformFee = (tripAmount: number, rateFromAdmin: number) => {
  return tripAmount * rateFromAdmin;
};
