import { useState, useEffect } from "react";
import { MapPin, Clock, DollarSign, Zap, Navigation, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface LiveRequest {
  id: string;
  pickup: string;
  dropoff: string;
  distance: string;
  riderName: string;
  riderRating: number;
  bidAmount: number;
  paymentMethod: "Cash" | "Card" | "EFT";
  expiresIn: number; // seconds
}

const mockRequests: LiveRequest[] = [
  {
    id: "r1",
    pickup: "Sandton City",
    dropoff: "Rosebank Mall",
    distance: "4.2 km",
    riderName: "Alex M.",
    riderRating: 4.9,
    bidAmount: 85,
    paymentMethod: "Cash",
    expiresIn: 45,
  },
  {
    id: "r2",
    pickup: "Morningside",
    dropoff: "Bryanston",
    distance: "6.8 km",
    riderName: "Thabo K.",
    riderRating: 4.7,
    bidAmount: 120,
    paymentMethod: "Card",
    expiresIn: 30,
  }
];

const DriverDashboard = () => {
  const [activeRequests, setActiveRequests] = useState<LiveRequest[]>(mockRequests);
  const [isOnline, setIsOnline] = useState(false);

  const handleAccept = (requestId: string) => {
    toast.success("Ride Accepted! Navigating to pickup...");
    setActiveRequests(prev => prev.filter(r => r.id !== requestId));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Earnings & Status */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border p-4">
        <div className="container mx-auto max-w-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Today's Earnings</p>
              <p className="text-xl font-heading font-bold">R 1,240.50</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${isOnline ? "text-success" : "text-muted-foreground"}`}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${isOnline ? "bg-success" : "bg-muted"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isOnline ? "translate-x-6" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold">Available Bids</h1>
          <p className="text-muted-foreground text-sm">Nearby riders looking for a trip</p>
        </div>

        {!isOnline ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
            <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Go online to start receiving ride requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {activeRequests.map((request) => (
                <motion.div
                  key={request.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: 100 }}
                  className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-elevated"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                          {request.riderName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{request.riderName}</p>
                          <p className="text-xs text-muted-foreground">⭐ {request.riderRating} Rider</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-heading font-bold text-primary">R{request.bidAmount}</p>
                        <span className="text-[10px] bg-muted px-2 py-1 rounded font-bold">
                          {request.paymentMethod.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 relative">
                      <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-border" />
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
                        <p className="text-sm font-medium">{request.pickup}</p>
                      </div>
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-3 h-3 rounded-full bg-accent border-2 border-background" />
                        <p className="text-sm font-medium">{request.dropoff}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="rounded-xl border-border text-foreground hover:bg-muted"
                      >
                        Counter Offer
                      </Button>
                      <Button 
                        onClick={() => handleAccept(request.id)}
                        className="bg-gradient-primary text-white rounded-xl shadow-glow"
                      >
                        Accept Ride
                      </Button>
                    </div>
                  </div>
                  
                  {/* Progress bar for expiry */}
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: request.expiresIn, ease: "linear" }}
                    className="h-1 bg-primary/30"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;
