import { useState } from "react";
import { ArrowLeft, Info, TrendingUp, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { calculateMarketAverage } from "@/lib/utils";

// --- Sub-component for Market Comparison ---
const MarketComparison = ({ userBid }: { userBid: number }) => {
  const rates = { uber: 450, bolt: 435, yango: 410 };
  const marketAvg = calculateMarketAverage(rates);
  const difference = userBid - marketAvg;
  const isAbove = difference > 0;

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Market Comparison</span>
          <div className="flex gap-1.5">
             <span className="px-2 py-0.5 bg-muted rounded text-[10px] font-bold">Uber: R450</span>
             <span className="px-2 py-0.5 bg-muted rounded text-[10px] font-bold">Bolt: R435</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase mb-1">Market Average</p>
            <p className="text-2xl font-heading font-bold">R {marketAvg.toFixed(2)}</p>
          </div>
          
          <div className={`text-right ${isAbove ? 'text-emerald-600' : 'text-amber-600'}`}>
            <p className="text-[10px] font-bold uppercase tracking-tighter mb-1">
              {isAbove ? "Fast Pickup" : "Saving Money"}
            </p>
            <div className="flex items-center justify-end gap-1 font-heading font-bold text-lg">
              <TrendingUp className={`w-4 h-4 ${!isAbove && 'rotate-180'}`} />
              <span>R {Math.abs(difference).toFixed(2)} {isAbove ? 'Extra' : 'Less'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const RiderCreateRequest = () => {
  const [riderBid, setRiderBid] = useState(400);

  const handlePostRequest = () => {
    console.log("Requesting trip with bid:", riderBid);
    // Logic to send request to the trip-feed
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-heading font-bold text-gradient-primary">Name Your Price</h1>
      </div>

      <main className="container mx-auto max-w-md p-6">
        <div className="text-center mb-10">
          <p className="text-sm text-muted-foreground mb-4 font-medium italic">
            "I am willing to pay..."
          </p>
          <div className="relative inline-block w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl font-heading font-bold text-muted-foreground/30">R</span>
            <input 
              type="number" 
              value={riderBid} 
              onChange={(e) => setRiderBid(Number(e.target.value))}
              className="w-full text-6xl font-heading font-bold text-center bg-transparent outline-none text-primary caret-primary"
            />
          </div>
        </div>

        {/* 📊 Live Market Data */}
        <MarketComparison userBid={riderBid} />

        <div className="mt-8 space-y-4">
          <div className="flex gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
            <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-[11px] text-emerald-800 leading-snug">
              <strong>6% Fee for Drivers:</strong> Because our fees are the lowest in South Africa, drivers are 40% more likely to accept your bid on RideoBid!
            </p>
          </div>

          <Button 
            onClick={handlePostRequest}
            className="w-full h-16 rounded-2xl text-xl font-bold shadow-glow hover:scale-[1.02] transition-transform"
          >
            Post Bid to Drivers
          </Button>
        </div>
      </main>
    </div>
  );
};

export default RiderCreateRequest;
