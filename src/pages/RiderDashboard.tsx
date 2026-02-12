import { useState, useEffect } from "react";
import { 
  MapPin, Clock, DollarSign, Zap, Navigation, Wallet, 
  ChevronRight, Star, AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// 🛑 Logic & Guard Imports
// Vi simulerar isDriverEligible här, men du kan flytta den till en utils-fil
const isDriverEligible = (debt: number) => debt <= 50; 

import DriverBlockedScreen from "@/components/DriverBlockedScreen";

interface LiveRequest {
  id: string;
  pickup: string;
  dropoff: string;
  distance: string;
  riderName: string;
  riderRating: number;
  bidAmount: number;
  paymentMethod: "Cash" | "Card" | "EFT";
  expiresIn: number;
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
  // 💰 State för skuld (Hämtas från din profiles-tabell i Supabase)
  const [currentDebt, setCurrentDebt] = useState(55.00); 
  const [activeRequests, setActiveRequests] = useState<LiveRequest[]>(mockRequests);
  const [isOnline, setIsOnline] = useState(false);

  // 🛑 THE SAFETY GATE: Stoppar blockerade förare omedelbart
  if (!isDriverEligible(currentDebt)) {
    return (
      <DriverBlockedScreen 
        debtAmount={currentDebt} 
        onUnlock={() => setCurrentDebt(0)} // Simulerar upplåsning efter betalning
      />
    );
  }

  const handleAccept = (requestId: string) => {
    toast.success("Resa accepterad! Navigerar till hämtning...");
    setActiveRequests(prev => prev.filter(r => r.id !== requestId));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header med Inkomst & Status */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border p-4 shadow-sm">
        <div className="container mx-auto max-w-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Dagens intäkter</p>
              <p className="text-xl font-heading font-bold text-foreground">R 1,240.50</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-2xl">
            <span className={`text-[10px] font-black tracking-tighter ${isOnline ? "text-emerald-500" : "text-muted-foreground"}`}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`w-10 h-5 rounded-full relative transition-colors ${isOnline ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
            >
              <motion.div 
                animate={{ x: isOnline ? 20 : 2 }}
                className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm" 
              />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Varning om föraren närmar sig gränsen (t.ex. vid R40) */}
        {currentDebt > 40 && currentDebt <= 50 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="text-xs text-amber-800 font-bold">
                Varning: Din skuld är <span className="underline">R {currentDebt.toFixed(2)}</span>. Betala snart för att undvika avstängning.
              </p>
            </div>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-[10px] h-8 rounded-xl font-bold uppercase">
              Betala
            </Button>
          </motion.div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold tracking-tight">Aktiva Bud</h1>
          <p className="text-muted-foreground text-sm">Passagerare i närheten som väntar på svar</p>
        </div>

        {!isOnline ? (
          <div className="text-center py-20 bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-bold italic">Gå online för att börja tjäna pengar</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {activeRequests.map((request) => (
                <motion.div
                  key={request.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="bg-card border-2 border-border rounded-[2rem] overflow-hidden shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl">
                          {request.riderName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{request.riderName}</p>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs font-bold">{request.riderRating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-heading font-bold text-primary">R{request.bidAmount}</p>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-full font-black uppercase tracking-widest">
                          {request.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8 relative">
                      <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-border border-dashed" />
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-primary border-4 border-background shadow-sm" />
                        <p className="text-sm font-bold text-foreground">{request.pickup}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-orange-500 border-4 border-background shadow-sm" />
                        <p className="text-sm font-bold text-foreground">{request.dropoff}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="rounded-2xl border-border h-14 font-bold text-muted-foreground">
                        Motbud
                      </Button>
                      <Button 
                        onClick={() => handleAccept(request.id)}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 font-bold shadow-glow"
                      >
                        Acceptera
                      </Button>
                    </div>
                  </div>
                  
                  {/* Timer bar */}
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: request.expiresIn, ease: "linear" }}
                    className="h-1.5 bg-primary/20"
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
