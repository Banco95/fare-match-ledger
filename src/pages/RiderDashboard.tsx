import { useState } from "react";
import { MapPin, Star, ChevronUp, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import MarketComparison from "@/components/MarketComparison"; // 🚀 Added this

interface Bid {
  id: string;
  driverName: string;
  rating: number;
  trips: number;
  amount: number;
  eta: string;
  vehicle: string;
}

interface TripRequest {
  id: string;
  pickup: string;
  dropoff: string;
  suggestedPrice: number;
  status: "pending" | "bidding" | "matched" | "completed";
  bids: Bid[];
  createdAt: string;
}

const mockTrips: TripRequest[] = [
  {
    id: "1",
    pickup: "Sandton City",
    dropoff: "OR Tambo Airport",
    suggestedPrice: 450,
    status: "bidding",
    createdAt: "2 min ago",
    bids: [
      { id: "b1", driverName: "James M.", rating: 4.8, trips: 342, amount: 450, eta: "4 min", vehicle: "Toyota Corolla" },
      { id: "b2", driverName: "Sarah K.", rating: 4.9, trips: 567, amount: 480, eta: "6 min", vehicle: "VW Polo" },
    ],
  },
];

const RiderDashboard = () => {
  const [trips] = useState<TripRequest[]>(mockTrips);
  const [expandedTrip, setExpandedTrip] = useState<string | null>("1");
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-heading font-bold text-gradient-primary">RideoBid</a>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Hi, Alex</span>
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">A</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">My Trips</h1>
            <p className="text-muted-foreground text-sm">Compare rates and set your bid</p>
          </div>
          <Button className="bg-gradient-primary text-white rounded-xl" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close" : "+ New Trip"}
          </Button>
        </div>

        {/* New Trip Form with Market Comparison Logic */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="p-6 rounded-2xl bg-card border border-border shadow-elevated space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-primary" />
                    <input className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border-none text-sm focus:ring-2 focus:ring-primary" placeholder="Pickup location" />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-accent" />
                    <input className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border-none text-sm focus:ring-2 focus:ring-primary" placeholder="Dropoff location" />
                  </div>
                </div>

                {/* 🚀 Integrated Market Comparison Logic here */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-4 tracking-widest text-center">Market Rate Discovery</p>
                  <MarketComparison />
                </div>

                <Button className="w-full bg-gradient-primary text-white py-6 rounded-xl text-lg font-heading font-bold shadow-glow hover:opacity-90">
                  Post Trip Request
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trip List */}
        <div className="space-y-4">
          {trips.map((trip) => (
            <motion.div key={trip.id} layout className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
              <div className="p-5 cursor-pointer" onClick={() => setExpandedTrip(expandedTrip === trip.id ? null : trip.id)}>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium"><div className="w-2 h-2 rounded-full bg-primary" /> {trip.pickup}</div>
                    <div className="flex items-center gap-2 text-sm font-medium"><div className="w-2 h-2 rounded-full bg-accent" /> {trip.dropoff}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-heading font-bold text-foreground">R{trip.suggestedPrice}</span>
                    <div className="flex items-center justify-end text-xs text-primary font-bold">
                       {trip.bids.length} Bids {expandedTrip === trip.id ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bids Dropdown */}
              <AnimatePresence>
                {expandedTrip === trip.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-border bg-muted/20">
                    <div className="p-4 space-y-3">
                      {trip.bids.map((bid) => (
                        <div key={bid.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{bid.driverName.charAt(0)}</div>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-bold">{bid.driverName}</span>
                                <span className="text-xs text-accent flex items-center"><Star className="w-3 h-3 fill-current mr-0.5" /> {bid.rating}</span>
                              </div>
                              <p className="text-[10px] text-muted-foreground">{bid.vehicle} • {bid.eta} away</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-heading font-bold">R{bid.amount}</span>
                            <Button size="sm" className="bg-primary text-white rounded-lg h-8">Accept</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RiderDashboard;
