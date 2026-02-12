import { motion } from "framer-motion";
import { Banknote, Star, CheckCircle2, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculatePlatformFee } from "@/lib/utils";
import { useAppSettings } from "@/contexts/SettingsContext";

const TripCompletion = () => {
  const { settings } = useAppSettings();
  
  // Mock final trip data
  const tripSummary = {
    riderName: "Leila K.",
    finalPrice: 420.00,
    pickup: "Sandton City",
    dropoff: "OR Tambo"
  };

  const platformFee = calculatePlatformFee(tripSummary.finalPrice, settings.commissonRate);

  const handleFinish = () => {
    // 1. Update Driver Debt in Database: debt = debt + platformFee
    // 2. Clear current trip state
    // 3. Redirect to DriverDashboard
    console.log(`Adding R${platformFee.toFixed(2)} to driver debt.`);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col justify-center items-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm text-center"
      >
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>

        <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">Trip Complete!</h1>
        <p className="text-muted-foreground text-sm mb-8">You arrived safely at {tripSummary.dropoff}</p>

        {/* 💵 Cash Collection Card */}
        <div className="bg-card border-2 border-primary/20 rounded-[2rem] p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
             <Banknote className="w-6 h-6 text-primary/20" />
          </div>
          
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Collect from Rider</p>
          <p className="text-5xl font-heading font-black text-primary mb-6">R {tripSummary.finalPrice.toFixed(2)}</p>
          
          <div className="space-y-3 pt-6 border-t border-border">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Platform Fee ({settings.commissonRate * 100}%)</span>
              <span className="font-bold text-destructive">- R {platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium text-emerald-600">Your Net Profit</span>
              <span className="font-bold text-emerald-600">R {(tripSummary.finalPrice - platformFee).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ⭐ Rider Rating */}
        <div className="mb-10">
          <p className="text-sm font-bold mb-4">Rate {tripSummary.riderName}</p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Star className="w-6 h-6 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleFinish}
          className="w-full h-16 rounded-2xl text-xl font-bold shadow-glow flex items-center justify-center gap-3"
        >
          Confirm Cash Received <ArrowRight className="w-6 h-6" />
        </Button>

        <p className="mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
          <Info className="w-3 h-3" /> Debt will be added to your MoMo ledger
        </p>
      </motion.div>
    </div>
  );
};

export default TripCompletion;
