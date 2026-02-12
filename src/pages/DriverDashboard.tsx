import { useState, useEffect } from "react";
import { 
  MapPin, Wallet, AlertTriangle, Navigation, Star, 
  TrendingDown, Lock, Smartphone, LogOut, Zap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase"; // Se till att du har din supabase-klient här

// 🛑 Logic & Context Imports
import { isDriverActive } from "@/lib/utils";
import { useAppSettings } from "@/contexts/SettingsContext";
import DriverBlockedScreen from "@/components/DriverBlockedScreen";
import KYCUpload from "@/components/KYCUpload";

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
  const { settings } = useAppSettings(); // Hämtar t.ex. debtLimit (50 ZAR)
  const [isOnline, setIsOnline] = useState(true);
  const [currentDriverId, setCurrentDriverId] = useState<string | null>(null);
  
  // 💰 Driver State
  const [currentDebt, setCurrentDebt] = useState(0.00); 
  const [kycStatus, setKycStatus] = useState<'NOT_STARTED' | 'PENDING' | 'VERIFIED'>('VERIFIED');

  // 1. Hämta initialt data och sätt upp Realtime-lyssnare
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentDriverId(user.id);
        
        // Hämta initial skuld
        const { data } = await supabase
          .from('profiles')
          .select('commission_debt, kyc_status')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setCurrentDebt(data.commission_debt || 0);
          setKycStatus(data.kyc_status || 'VERIFIED');
        }
      }
    };
    getUser();
  }, []);

  // 🔄 REALTIME: Lyssna på skuldändringar (6% triggern eller betalningar)
  useEffect(() => {
    if (!currentDriverId) return;

    const debtSubscription = supabase
      .channel('live-debt-check')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${currentDriverId}`,
        },
        (payload) => {
          const newDebt = payload.new.commission_debt;
          if (newDebt !== undefined) {
            setCurrentDebt(newDebt);
            
            if (newDebt >= settings.debtLimit) {
              toast.error("Skuldgräns nådd! Kontot pausas tills betalning mottagits.", { id: "block-toast" });
            } else if (newDebt > settings.debtLimit * 0.8) {
              toast.warning("Varning: Du närmar dig din skuldgräns.", { id: "warning-toast" });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(debtSubscription);
    };
  }, [currentDriverId, settings.debtLimit]);

  // 🛡️ Beräkningar för UI
  const debtPercentage = (currentDebt / settings.debtLimit) * 100;
  const isBlocked = currentDebt >= settings.debtLimit;
  const isWarning = debtPercentage >= 80 && !isBlocked;

  // 🛑 GUARD: Kontrollera om föraren får arbeta
  const { canWork, reason } = isDriverActive(currentDebt, settings.debtLimit, kycStatus);

  if (!canWork) {
    if (reason === 'KYC_PENDING' || kycStatus === 'NOT_STARTED') {
      return <KYCUpload onComplete={() => setKycStatus('PENDING')} />;
    }
    if (reason === 'DEBT_BLOCKED' || isBlocked) {
      return (
        <DriverBlockedScreen 
          debtAmount={currentDebt} 
          onUnlock={() => setCurrentDebt(0)} // Reset lokalt, Paystack hanterar DB
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-heading font-black text-primary tracking-tighter">RideoBid</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">South Africa</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              disabled={isBlocked}
              onClick={() => setIsOnline(!isOnline)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${isOnline ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-muted"}`}
            >
              <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${isOnline ? "translate-x-7" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        
        {/* Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[2rem] p-8 mb-8 border-2 transition-all ${
            isWarning ? "border-amber-500/30 bg-amber-500/5 shadow-amber-500/5" : "border-border bg-card shadow-xl"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-2xl">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-heading font-bold text-lg">Provisionskonto</h2>
            </div>
            <span className="text-[10px] font-black px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-widest">6% Fee</span>
          </div>
          
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Obetald skuld</p>
              <p className={`text-4xl font-heading font-black ${isWarning ? "text-amber-600" : "text-foreground"}`}>
                R {currentDebt.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Gräns</p>
              <p className="text-xl font-heading font-bold">R {settings.debtLimit.toFixed(2)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(debtPercentage, 100)}%` }}
              className={`h-full rounded-full ${isWarning ? "bg-amber-500" : "bg-primary"}`}
            />
          </div>
          
          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-2 font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all"
          >
            <TrendingDown className="w-5 h-5" /> Reglera skuld via Paystack
          </Button>
        </motion.div>

        {/* Live Feed */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold">Inkommande bud</h2>
          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Feed</span>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {isOnline && mockRequests.map((req) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[2rem] bg-card border-2 border-border p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                      <span className="text-sm font-bold leading-tight">{req.pickup}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                      <span className="text-sm font-bold leading-tight">{req.dropoff}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-heading font-black text-primary">R {req.suggestedPrice}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">{req.distance}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                   <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-amber-500 fill-current" /> 
                    <span className="text-xs font-black">{req.riderRating}</span>
                   </div>
                   <span className="text-xs font-bold text-muted-foreground">{req.riderName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="flex-1 h-12 rounded-xl font-black text-sm uppercase shadow-glow">
                    Acceptera R {req.suggestedPrice}
                  </Button>
                  <Button variant="outline" className="h-12 w-12 rounded-xl border-2 flex items-center justify-center p-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </Button>
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
