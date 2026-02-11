import { useState } from "react";
import { MapPin, Clock, DollarSign, User, Star, ChevronUp, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
    pickup: "Westlands Mall",
    dropoff: "JKIA Airport",
    suggestedPrice: 1500,
    status: "bidding",
    createdAt: "2 min ago",
    bids: [
      { id: "b1", driverName: "James M.", rating: 4.8, trips: 342, amount: 1500, eta: "4 min", vehicle: "Toyota Vitz" },
      { id: "b2", driverName: "Sarah K.", rating: 4.9, trips: 567, amount: 1600, eta: "6 min", vehicle: "Honda Fit" },
      { id: "b3", driverName: "Peter O.", rating: 4.6, trips: 128, amount: 1400, eta: "3 min", vehicle: "Suzuki Alto" },
    ],
  },
  {
    id: "2",
    pickup: "CBD Archives",
    dropoff: "Karen Hub",
    suggestedPrice: 800,
    status: "pending",
    createdAt: "5 min ago",
    bids: [],
  },
];

const RiderDashboard = () => {
  const [trips] = useState<TripRequest[]>(mockTrips);
  const [expandedTrip, setExpandedTrip] = useState<string | null>("1");
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
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
            <p className="text-muted-foreground text-sm">Post a trip and get bids from nearby drivers</p>
          </div>
          <Button variant="hero" onClick={() => setShowForm(!showForm)}>
            + New Trip
          </Button>
        </div>

        {/* New Trip Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="p-6 rounded-xl bg-card border border-border shadow-elevated">
                <h3 className="font-heading font-semibold text-card-foreground mb-4">Request a Ride</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-primary" />
                    <input
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Pickup location"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-accent" />
                    <input
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Dropoff location"
                    />
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Suggested price (KES)"
                    />
                  </div>
                  <Button variant="hero" className="w-full" size="lg">
                    Post Trip Request
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trip List */}
        <div className="space-y-4">
          {trips.map((trip) => (
            <motion.div
              key={trip.id}
              layout
              className="rounded-xl bg-card border border-border shadow-card overflow-hidden"
            >
              <div
                className="p-5 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedTrip(expandedTrip === trip.id ? null : trip.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium text-card-foreground">{trip.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm font-medium text-card-foreground">{trip.dropoff}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-lg font-heading font-bold text-foreground">KES {trip.suggestedPrice}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      trip.status === "bidding" ? "bg-primary/10 text-primary" :
                      trip.status === "pending" ? "bg-warning/10 text-warning" :
                      "bg-success/10 text-success"
                    }`}>
                      {trip.status === "bidding" ? `${trip.bids.length} bids` : trip.status}
                    </span>
                    {expandedTrip === trip.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedTrip === trip.id && trip.bids.length > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="p-4 space-y-3 bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Driver Bids</p>
                      {trip.bids.map((bid) => (
                        <div key={bid.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                              {bid.driverName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-card-foreground">{bid.driverName}</span>
                                <span className="flex items-center gap-0.5 text-xs text-accent">
                                  <Star className="w-3 h-3 fill-current" /> {bid.rating}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{bid.vehicle} · {bid.eta} away · {bid.trips} trips</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-heading font-bold text-foreground">KES {bid.amount}</span>
                            <Button variant="hero" size="sm">
                              <Check className="w-4 h-4" /> Accept
                            </Button>
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
