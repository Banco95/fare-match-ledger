import { useState, useEffect } from "react";
import { 
  MapPin, Wallet, AlertTriangle, Navigation, Star, 
  TrendingDown, Lock, Smartphone, LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
  const { settings } = useAppSettings();
  const [isOnline, setIsOnline] = useState(true);
  
  // 💰 Driver State
  const [currentDebt, setCurrentDebt] = useState(55.00); 
  const [kycStatus, setKycStatus] = useState<'NOT_STARTED' | 'PENDING' | 'VERIFIED'>('VERIFIED');
  
  const debtPercentage = (currentDebt / settings.debtLimit) * 100;

  // 🛡️ Debt Logic (Varningar och Blockering)
  const isBlocked = currentDebt >= settings.debtLimit;
  const isWarning = debtPercentage >= 80 && !isBlocked;

  useEffect(() => {
    if (isBlocked) {
      toast.error("DIN PROVISION ÄR FÖR HÖG. Du kommer inte att få några nya bud förrän du har betalat av din skuld från den senaste resan.", {
        duration: 8000,
        id: "block-toast"
      });
    } else if (isWarning) {
      toast.warning("VARNING: Din skuld är nära gränsen. Betala snart för att undvika avstängning.", {
        id: "warning-toast"
      });
    }
  }, [currentDebt, isBlocked, isWarning]);

  // ✅ Hantera betalning
  const handleManualUnlock = () => {
    setCurrentDebt(0);
    toast.success("Tack för din betalning! Ditt konto är nu aktivt.");
  };

  // ✅ KYC Completion
  const handleKYCComplete = () => {
    setKycStatus('PENDING');
    toast.info("ID uppladdat. Verifiering pågår.");
  };

  // 🛑 GUARD: Kontrollera om föraren får arbeta
  const { canWork, reason } = isDriverActive(currentDebt, settings.debtLimit, kycStatus);

  if (!canWork) {
    if (reason === 'KYC_PENDING' || kycStatus === 'NOT_STARTED') {
      return <KYCUpload onComplete={handleKYCComplete} />;
    }
    // Om blockerad på grund av skuld, visa den dedikerade blockeringsskärmen
    if (reason === 'DEBT_BLOCKED' || isBlocked) {
      return (
        <DriverBlockedScreen 
          debtAmount={currentDebt} 
          onUnlock={handleManualUnlock} 
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-heading font-bold text-gradient-primary">RideoBid</a>
          <div className="flex items-center gap-4">
            <button
              disabled={isBlocked}
              onClick={() => setIsOnline(!isOnline)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isOnline ? "bg-primary" : "bg-muted"} ${isBlocked ? "opacity-50 cursor-not-allowed" : ""}`}
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
        
        {/* ⚠️ Dynamiskt varningskort vid hög skuld */}
        {isWarning && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 bg-warning/10 border border-warning/30 p-4 rounded-2xl flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
            <div>
              <p className="text-sm font-bold text-warning">Betalning krävs snart</p>
              <p className="text-xs text-warning/80">Din skuld är på {debtPercentage.toFixed(0)}%. Betala nu för att slippa bli blockerad efter nästa resa.</p>
            </div>
          </motion.div>
        )}

        {/* Commission Wallet Card */}
        <motion.div
          className={`rounded-xl p-6 mb-8 border ${
            isWarning ? "bg-warning/5 border-warning/30" : "bg-card border-border shadow-card"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              <h2 className="font-heading font-semibold text-foreground">Commission Wallet</h2>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-muted rounded-md uppercase">6% Fee</span>
          </div>
          
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Unpaid Fees</p>
              <p className={`text-3xl font-heading font-bold ${isWarning ? "text-warning" : "text-destructive"}`}>
                R {currentDebt.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Limit</p>
              <p className="text-lg font-heading font-semibold">R {settings.debtLimit.toFixed(2)}</p>
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isWarning ? "bg-warning" : "bg-primary"
              }`}
              style={{ width: `${Math.min(debtPercentage, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <span className="text-xs text-muted-foreground">{debtPercentage.toFixed(0)}% använt</span>
            <Button 
              onClick={handleManualUnlock}
              variant="outline" 
              size="sm" 
              className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20 hover:bg-emerald-600 hover:text-white font-bold"
            >
              <TrendingDown className="w-4 h-4 mr-2" /> Pay via MoMo / M-Pesa
            </Button>
          </div>
        </motion.div>

        {/* Nearby Requests - Blockerade om skuld är för hög */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-foreground">Nearby Requests</h2>
          <span className="flex items-center gap-1 text-sm text-primary font-bold tracking-tight">
            <Navigation className="w-4 h-4 animate-bounce" /> Live Feed
          </span>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {mockRequests.map((req) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl bg-card border border-border shadow-card p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm font-bold">{req.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-sm font-bold">{req.dropoff}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-heading font-bold text-foreground">R {req.suggestedPrice}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{req.distance}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground font-bold">
                  <Star className="w-3 h-3 text-orange-400 fill-current" /> {req.riderRating} · {req.riderName}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="hero" size="sm" className="flex-1 font-bold text-sm">
                    Accept R {req.suggestedPrice}
                  </Button>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="Bid"
                      className="w-20 px-3 py-2 rounded-lg bg-muted border border-border text-sm font-bold focus:border-primary outline-none"
                    />
                    <Button variant="outline" size="sm" className="font-bold">Bid</Button>
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
