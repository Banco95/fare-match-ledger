import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Navigation, Phone, MessageSquare, AlertTriangle, ChevronUp } from "lucide-react";
import { Button } from "../components/ui/button";

const RiderTripProgress = () => {
  const [showDetails, setShowDetails] = useState(false);

  // Mock Trip Data
  const trip = {
    driverName: "Sipho",
    eta: "8 mins",
    destination: "OR Tambo International Airport",
    price: 420.00,
    securityPin: "4829"
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 🗺️ MAP PLACEHOLDER */}
      <div className="absolute inset-0 bg-muted flex items-center justify-center">
        <div className="text-muted-foreground flex flex-col items-center">
          <Navigation className="w-12 h-12 mb-2 animate-pulse text-primary" />
          <p className="font-medium">Live Map Integration...</p>
        </div>
      </div>

      {/* 🛡️ TOP FLOATING SAFETY BAR */}
      <div className="absolute top-12 left-4 right-4 z-20">
        <div className="bg-background/90 backdrop-blur-md border border-border p-3 rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Safety PIN</p>
              <p className="text-lg font-black tracking-widest text-primary">{trip.securityPin}</p>
            </div>
          </div>
          <Button size="sm" variant="destructive" className="rounded-xl px-4 h-10">
            <AlertTriangle className="w-4 h-4 mr-2" /> SOS
          </Button>
        </div>
      </div>

      {/* 🚐 BOTTOM DRIVER CARD */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="absolute bottom-0 left-0 right-0 z-30 bg-card border-t border-border rounded-t-[2.5rem] shadow-2xl"
      >
        <div className="p-6">
          {/* Pull Tab */}
          <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-heading font-bold">{trip.eta} away</h2>
              <p className="text-sm text-muted-foreground">Arriving at {trip.destination}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-heading font-bold text-primary">R {trip.price.toFixed(2)}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Fixed Bid Price</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary">S</div>
            <div className="flex-1">
              <p className="font-bold">{trip.driverName}</p>
              <p className="text-xs text-muted-foreground italic">"I'm on my way, see you soon!"</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" className="rounded-full w-12 h-12">
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full w-12 h-12 bg-primary text-white border-none">
                <Phone className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground text-xs"
            onClick={() => setShowDetails(!showDetails)}
          >
            <ChevronUp className={`w-4 h-4 mr-2 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            {showDetails ? "Hide Trip Details" : "Show Trip Details"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default RiderTripProgress;
