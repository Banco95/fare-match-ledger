import { useState, useEffect } from "react";
import { Timer, MapPin, Star, Zap, Info, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface TripBid {
  id: string;
  riderName: string;
  riderRating: number;
  pickup: string;
  dropoff: string;
  riderBid: number;
  marketAvg: number;
  timeAway: string;
}

const mockBids: TripBid[] = [
  { id: "b1", riderName: "Sipho M.", riderRating: 4.8, pickup: "Sandton City", dropoff: "OR Tambo", riderBid: 420, marketAvg: 450, timeAway: "4 min" },
  { id: "b2", riderName: "Leila K.", riderRating: 4.9, pickup: "Rosebank Mall", dropoff: "Melrose Arch", riderBid: 110, marketAvg: 120, timeAway: "2 min" },
];

const DriverTripFeed = () => {
  const COMMISSION_RATE = 0.06;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="p-4 border-b border-border bg-card sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-heading font-bold">Live Trip Bids</h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase">Searching...</span>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-2xl mx-auto">
        <AnimatePresence>
          {mockBids.map((bid) => {
            const platformFee = bid.riderBid * COMMISSION_RATE;
            const driverTakeHome = bid.riderBid - platformFee;

            return (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border rounded-3xl p-5 shadow-sm relative overflow-hidden"
              >
                {/* Market Comparison Badge */}
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-muted border-l border-b border-border rounded-bl-2xl">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Uber/Bolt Avg: R{bid.marketAvg}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-xl font-bold">
                    {bid.riderName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{bid.riderName}</h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-accent">
                        <Star className="w-3 h-3 fill-current" /> {bid.riderRating}
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                      {bid.timeAway} away from you
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <p className="text-sm font-medium">{bid.pickup}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
                    <p className="text-sm font-medium">{bid.dropoff}</p>
                  </div>
                </div>

                {/* 💰 The Money Breakdown */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-2xl border border-border/50 mb-6">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Rider's Offer</p>
                    <p className="text-2xl font-heading font-black">R {bid.riderBid.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-emerald-600 uppercase font-bold mb-1">Your Take Home</p>
                    <p className="text-2xl font-heading font-black text-emerald-600">R {driverTakeHome.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                   <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold">
                     Ignore
                   </Button>
                   <Button className="flex-[2] h-14 rounded-2xl font-bold text-lg shadow-glow-primary">
                     Accept Request
                   </Button>
                </div>

                <p className="text-[9px] text-center mt-4 text-muted-foreground uppercase tracking-widest">
                   <Info className="w-3 h-3 inline mr-1 mb-0.5" /> Includes R {platformFee.toFixed(2)} platform fee (6%)
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DriverTripFeed;
