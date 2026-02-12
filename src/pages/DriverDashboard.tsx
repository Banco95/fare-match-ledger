import { useState } from "react";
import { MapPin, Wallet, AlertTriangle, Navigation, Star, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// 🛑 Logic Imports
import { isDriverEligible } from "@/lib/utils";
import DriverBlockedScreen from "@/components/DriverBlockedScreen";

interface NearbyRequest {
  id: string;
  pickup: string;
  dropoff: string;
  suggestedPrice: number;
  distance: string;
  riderName: string;
  riderRating: number;
  postedAgo: string;
}

const mockRequests: NearbyRequest[] = [
  { id: "1", pickup: "Sandton City", dropoff: "OR Tambo Airport", suggestedPrice: 450, distance: "1.2 km", riderName: "Alex N.", riderRating: 4.7, postedAgo: "2 min" },
  { id: "2", pickup: "Rosebank Mall", dropoff: "Melrose Arch", suggestedPrice: 120, distance: "0.8 km", riderName: "Grace W.", riderRating: 4.9, postedAgo: "4 min" },
  { id: "3", pickup: "Pretoria Central", dropoff: "Menlyn Maine", suggestedPrice: 280, distance: "3.1 km", riderName: "Brian T.", riderRating: 4.5, postedAgo: "1 min" },
];

const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);
  
  // 💰 State for the 6% Commission Ledger
  const [currentDebt, setCurrentDebt] = useState(55.00); 
  const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});

  const debtLimit = 50.00; // R50 limit before lockout
  const debtPercentage = (currentDebt / debtLimit) * 100;

  // ✅ The Unlock Logic: Triggered after successful Mobile Money payment
  const handleManualUnlock = () => {
    setCurrentDebt(0);
    toast.success("Payment Received! Your account is now active.");
  };

  // 🛑 GUARD: Check if driver is blocked before rendering dashboard
  if (!isDriverEligible(currentDebt)) {
    return (
      <DriverBlockedScreen 
        debtAmount={currentDebt} 
        onUnlock={handleManualUnlock} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-heading font-bold text-gradient-primary">RideoBid</a>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isOnline ? "bg-primary" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-primary-foreground shadow transition-transform duration-300 ${isOnline ? "translate-x-7" : ""}`} />
            </button>
            <span className={`text-sm font-medium ${isOnline ? "text-primary" : "text-muted-foreground"}`}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Commission Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-6 mb-8 border ${
            debtPercentage > 80 ? "bg-warning/5 border-warning/30" : "bg-card border-border shadow-card"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              <h2 className="font-heading font-semibold text-foreground">Commission Wallet</h2>
            </div>
            {debtPercentage > 80 && (
              <span className="flex items-center gap-1 text-xs font-medium text-warning animate-pulse">
                <AlertTriangle className="w-3 h-3" /> Approaching Limit
              </span>
            )}
          </div>
          
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Unpaid Fees (6%)</p>
              <p className="text-3xl font-heading font-bold text-destructive">
                R {currentDebt.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Max Limit</p>
              <p className="text-lg font-heading font-semibold text-foreground">R {debtLimit.toFixed(2)}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                debtPercentage > 80 ? "bg-warning" : "bg-primary"
              }`}
              style={{ width: `${Math.min(debtPercentage, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <span className="text-xs text-muted-foreground">{debtPercentage.toFixed(0)}% of limit used</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20 hover:bg-emerald-600 hover:text-white"
            >
              <TrendingDown className="w-4 h-4 mr-2" /> Pay via MoMo
            </Button>
          </div>
        </motion.div>

        {/* Nearby Requests */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-foreground">Nearby Requests</h2>
          <span className="flex items-center gap-1 text-sm text-primary">
            <Navigation className="w-4 h-4 animate-bounce" /> Live
          </span>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {mockRequests.map((req) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl bg-card border border-border shadow-card p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">{req.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm font-medium">{req.dropoff}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-heading font-bold text-foreground">R {req.suggestedPrice}</p>
                    <p className="text-xs text-muted-foreground">{req.distance} away</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 text-accent fill-current" /> {req.riderRating} · {req.riderName}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="hero" size="sm" className="flex-1">
                    Accept R {req.suggestedPrice}
                  </Button>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="Your bid"
                      className="w-24 px-3 py-2 rounded-lg bg-muted border border-border text-sm"
                    />
                    <Button variant="outline" size="sm">Bid</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
