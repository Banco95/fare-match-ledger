import React, { useState } from 'react';
import { calculateMarketAverage, validateBid, PaymentMethod } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MarketComparison = () => {
  // 1. Mock Market Rates (In a real app, these come from an API)
  const rates = { uber: 160, bolt: 145, yango: 130 };
  const marketAvg = calculateMarketAverage(rates);
  
  const [userBid, setUserBid] = useState(marketAvg);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('CASH');

  const isFair = validateBid(userBid, marketAvg);

  return (
    <div className="space-y-6 p-4">
      {/* Side-by-Side Market Reference */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {Object.entries(rates).map(([name, price]) => (
          <div key={name} className="p-2 bg-muted rounded-lg border border-border">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">{name}</p>
            <p className="font-heading font-semibold text-foreground text-sm">R{price}</p>
          </div>
        ))}
      </div>

      {/* The Bidding Zone */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Market Average: R{marketAvg.toFixed(2)}</p>
          <input 
            type="number" 
            value={userBid}
            onChange={(e) => setUserBid(Number(e.target.value))}
            className="text-4xl font-bold bg-transparent text-center w-full focus:outline-none text-gradient-primary font-heading"
          />
          <p className="text-xs mt-1 font-medium">
            {isFair ? "✅ Fair Bid - Drivers will likely accept" : "⚠️ Low Bid - May take longer to match"}
          </p>
        </CardContent>
      </Card>

      {/* Payment Selection (Cash or MoMo Only) */}
      <div className="flex gap-4">
        {['CASH', 'MOBILE_MONEY'].map((m) => (
          <button
            key={m}
            onClick={() => setPayMethod(m as PaymentMethod)}
            className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${
              payMethod === m ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
            }`}
          >
            {m === 'CASH' ? '💵 Cash' : '📱 MoMo'}
          </button>
        ))}
      </div>
    </div>
  );
};
