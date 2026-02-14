import { useState, useEffect } from "react";
import { 
  MapPin, Wallet, AlertTriangle, Navigation, Star, 
  TrendingDown, Lock, Smartphone, LogOut, Zap 
} from "lucide-react";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

// 🛑 Logic & Context Imports
import { isDriverActive } from "@/lib/utils";
import { useAppSettings } from "@/contexts/SettingsContext";
import DriverBlockedScreen from "../components/DriverBlockedScreen";
import KYCUpload from "../components/KYCUpload";

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
];

const DriverDashboard = () => {
  const { settings } = useAppSettings(); 
  const [isOnline, setIsOnline] = useState(true);
  const [currentDriverId, setCurrentDriverId] = useState<string | null>(null);
  const [currentDebt, setCurrentDebt] = useState(0.00); 
  const [kycStatus, setKycStatus] = useState<'NOT_STARTED' | 'PENDING' | 'VERIFIED'>('VERIFIED');

  // 1. Initial laddning av förarens data
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentDriverId(user.id);
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

  // 🔄 REALTIME: Låser dashboarden PÅ SEKUNDEN en skuld uppstår
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
            if (newDebt > 0) {
              toast.error("Ny skuld registrerad. Betala provisionen för att se nya bud.", { 
                id: "block-toast",
                duration: 5000 
              });
            } else {
              toast.success("Tack! Ditt konto är nu upplåst.");
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(debtSubscription);
    };
  }, [currentDriverId]);

  // 💳 Funktion för att hantera Mobile Money-betalning (MTN, Airtel, M-Pesa)
  const handleMomoPayment = async (amount: number, provider: 'MTN' | 'AIRTEL' | 'MPESA') => {
    const toastId = toast.loading(`Initierar ${provider}-betalning...`);
    
    try {
      // Anropar Edge Function för Mobile Money STK Push
      const { data, error } = await supabase.functions.invoke('process-momo-commission', {
        body: { driverId: currentDriverId, amount, provider }
      });

      if (error) throw error;
      toast.success("Kontrollera din telefon och slå in din PIN för att godkänna.", { id: toastId });
    } catch (err) {
      toast.error("Kunde inte initiera betalning. Försök igen eller kontakta support.", { id: toastId });
    }
  };

  // 🛡️ STRIKT LOGIK: Blockera om skuld > 0
  const isBlocked = currentDebt > 0;

  // 🛑 GUARD: KYC
  if (kycStatus !== 'VERIFIED') {
    return <KYCUpload onComplete={() => setKycStatus('PENDING')} />;
  }

  // 🛑 GUARD: Skuld (Visar blockeringsskärm med MoMo-alternativ)
  if (isBlocked) {
    return (
      <DriverBlockedScreen 
        debtAmount={currentDebt} 
        message="Betala provisionen för din senaste resa för att låsa upp nya bud direkt."
        onMomoPay={handleMomoPayment} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-black text-primary tracking-tighter italic">RIDEOBID</span>
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Driver Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isOnline ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
              {isOnline ? "Aktiv" : "Vilande"}
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`relative w-12 h-6 rounded-full transition-all ${isOnline ? "bg-emerald-500" : "bg-muted"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isOnline ? "left-7" : "left-1"}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Välkommen tillbaka!</h1>
            <p className="text-sm text-muted-foreground font-medium">Ditt konto är aktivt. Inga skulder.</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Live Feed Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold">Lediga bud i närheten</h2>
            <span className="text-[10px] font-bold text-primary animate-pulse uppercase tracking-wider">Live Sökning</span>
          </div>
          
          <AnimatePresence>
            {isOnline ? (
              mockRequests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card border-2 border-border rounded-[2rem] p-6 shadow-sm hover:border-primary/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 font-bold text-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        {req.pickup}
                      </div>
                      <div className="flex items-center gap-3 font-bold text-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        {req.dropoff}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary">R {req.suggestedPrice}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{req.distance}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button className="flex-1 h-12 rounded-xl font-black uppercase text-xs shadow-glow">
                      Acceptera bud
                    </Button>
                    <Button variant="outline" className="h-12 w-12 rounded-xl border-2 font-bold">
                      R+
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 opacity-50 bg-muted/30 rounded-[2rem] border-2 border-dashed border-border">
                <Smartphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="font-bold">Gå online för att börja tjäna pengar</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
