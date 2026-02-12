import { TrendingUp, Info } from "lucide-react";
import { calculateMarketAverage } from "@/lib/utils";

const MarketComparison = ({ userBid }: { userBid: number }) => {
  // Mock data - in a real app, this comes from an API
  const rates = { uber: 450, bolt: 435, yango: 410 };
  const marketAvg = calculateMarketAverage(rates);
  
  const difference = userBid - marketAvg;
  const isAbove = difference > 0;

  return (
    <div className="space-y-4">
      {/* 📊 Market Price Comparison */}
      <div className="bg-muted/30 rounded-2xl p-4 border border-border">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Market Reference</span>
          <div className="flex gap-2">
             <span className="px-2 py-0.5 bg-white border rounded text-[10px] font-bold text-black">Uber: R450</span>
             <span className="px-2 py-0.5 bg-white border rounded text-[10px] font-bold text-black">Bolt: R435</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase">Average Market Price</p>
            <p className="text-xl font-heading font-bold text-foreground">R {marketAvg.toFixed(2)}</p>
          </div>
          
          <div className={`text-right ${isAbove ? 'text-emerald-600' : 'text-amber-600'}`}>
            <p className="text-[10px] font-bold uppercase tracking-tighter">
              {isAbove ? "High Chance of Acceptance" : "Budget-Friendly Bid"}
            </p>
            <div className="flex items-center justify-end gap-1 font-heading font-bold">
              <TrendingUp className={`w-4 h-4 ${!isAbove && 'rotate-180'}`} />
              <span>{Math.abs(difference).toFixed(2)} {isAbove ? 'Above' : 'Below'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 💡 Education Note */}
      <div className="flex gap-2 p-3 bg-primary/5 border border-primary/10 rounded-xl">
        <Info className="w-4 h-4 text-primary shrink-0" />
        <p className="text-[11px] text-primary/80 leading-snug">
          Bidding close to the market average helps you find a driver **faster**, while bidding lower helps you save money!
        </p>
      </div>
    </div>
  );
};
