import { useState } from "react";
import { MapPin, Clock, DollarSign, Wallet, AlertTriangle, Navigation, Star, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
  { id: "1", pickup: "Westlands Mall", dropoff: "JKIA Airport", suggestedPrice: 1500, distance: "1.2 km", riderName: "Alex N.", riderRating: 4.7, postedAgo: "2 min" },
  { id: "2", pickup: "Kilimani Junction", dropoff: "Ngong Road", suggestedPrice: 500, distance: "0.8 km", riderName: "Grace W.", riderRating: 4.9, postedAgo: "4 min" },
  { id: "3", pickup: "Upperhill Hospital", dropoff: "Langata Mall", suggestedPrice: 900, distance: "3.1 km", riderName: "Brian T.", riderRating: 4.5, postedAgo: "1 min" },
];

const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [walletBalance] = useState(-450);
  const [debtLimit] = useState(-1500);
  const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});

  const debtPercentage = Math.abs(walletBalance / debtLimit) * 100;
  const isBlocked = walletBalance <= debtLimit;

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
        {/* Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-6 mb-8 border ${
            isBlocked ? "bg-destructive/5 border-destructive/30" :
            debtPercentage > 60 ? "bg-warning/5 border-warning/30" :
            "bg-card border-border shadow-card"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              <h2 className="font-heading font-semibold text-foreground">Commission Wallet</h2>
            </div>
            {debtPercentage > 60 && (
              <span className="flex items-center gap-1 text-xs font-medium text-warning">
                <AlertTriangle className="w-3 h-3" /> {isBlocked ? "Account Blocked" : "Approaching Limit"}
              </span>
            )}
          </div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
              <p className={`text-3xl font-heading font-bold ${walletBalance < 0 ? "text-destructive" : "text-success"}`}>
                KES {walletBalance.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Debt Limit</p>
              <p className="text-lg font-heading font-semibold text-foreground">KES {Math.abs(debtLimit).toLocaleString()}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                debtPercentage > 80 ? "bg-destructive" : debtPercentage > 60 ? "bg-warning" : "bg-primary"
              }`}
              style={{ width: `${Math.min(debtPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">{debtPercentage.toFixed(0)}% used</span>
            <Button variant="accent" size="sm" className="mt-2">
              <TrendingDown className="w-4 h-4" /> Pay Commission
            </Button>
          </div>
        </motion.div>

        {/* Nearby Requests */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-foreground">Nearby Requests</h2>
          <span className="flex items-center gap-1 text-sm text-primary animate-pulse-glow">
            <Navigation className="w-4 h-4" /> Live
          </span>
        </div>

        {isBlocked ? (
          <div className="p-8 text-center rounded-xl bg-destructive/5 border border-destructive/20">
            <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <h3 className="font-heading font-semibold text-foreground mb-2">Account Blocked</h3>
            <p className="text-sm text-muted-foreground mb-4">Your commission debt has exceeded the limit. Pay your balance to resume taking rides.</p>
            <Button variant="accent">Pay Now</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {mockRequests.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-card border border-border shadow-card p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium text-card-foreground">{req.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm font-medium text-card-foreground">{req.dropoff}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-heading font-bold text-foreground">KES {req.suggestedPrice}</p>
                    <p className="text-xs text-muted-foreground">{req.distance} away · {req.postedAgo} ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent fill-current" /> {req.riderRating}
                  </span>
                  <span>· {req.riderName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="hero"
                    size="sm"
                    className="flex-1"
                  >
                    Accept at KES {req.suggestedPrice}
                  </Button>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={bidAmounts[req.id] || ""}
                      onChange={(e) => setBidAmounts({ ...bidAmounts, [req.id]: Number(e.target.value) })}
                      placeholder="Your bid"
                      className="w-24 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button variant="outline-hero" size="sm">
                      Bid
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;
