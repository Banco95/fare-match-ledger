import { useState } from "react";
import { 
  Lock, AlertCircle, Smartphone, ArrowRight, CreditCard, 
  Loader2, CheckCircle2, CheckCircle, ShieldCheck, HelpCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BlockedScreenProps {
  debtAmount: number;
  onUnlock: () => void;
}

const DriverBlockedScreen = ({ debtAmount, onUnlock }: BlockedScreenProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "success">("idle");
  const [method, setMethod] = useState<"MTN" | "Airtel" | "M-Pesa" | "Card" | null>(null);

  const handlePayment = () => {
    if (method === "Card") {
      // Direkt till framgång för demo (kortbetalning är oftast snabbare)
      setStatus("loading");
      setTimeout(() => setStatus("success"), 2000);
      return;
    }

    setStatus("loading");
    // Simulerar STK Push (M-Pesa/MoMo prompt)
    setTimeout(() => {
      setStatus("sent");
      // Simulerar att föraren anger sin PIN-kod efter 4 sekunder
      setTimeout(() => {
        setStatus("success");
      }, 4000);
    }, 1500);
  };

  // ✅ STATE: SUCCESS (Konto upplåst)
  if (status === "success") {
    return (
      <div className="fixed inset-0 z-[110] bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-4xl font-heading font-bold mb-3">Betalning Bekräftad!</h1>
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold mb-8">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.2em]">Konto Aktiverat</span>
          </div>

          <p className="text-muted-foreground text-sm max-w-xs mb-10 leading-relaxed">
            Din provision är nu reglerad. Du är återigen auktoriserad att ta emot nya reseförfrågningar.
          </p>

          <Button 
            onClick={onUnlock}
            className="w-full bg-foreground text-background h-16 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 shadow-xl"
          >
            Gå till Live-bud <ArrowRight className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    );
  }

  // 📲 STATE: WAITING FOR PIN (STK Push skickad)
  if (status === "sent") {
    return (
      <div className="fixed inset-0 z-[110] bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-emerald-500" />
          </div>
          <Loader2 className="absolute -top-1 -right-1 w-6 h-6 text-emerald-500 animate-spin" />
        </div>
        
        <h1 className="text-2xl font-heading font-bold mb-4">Kolla din telefon</h1>
        <p className="text-muted-foreground text-sm max-w-xs mb-10 leading-relaxed">
          Vi har skickat en **{method}**-begäran. Ange din PIN för att godkänna betalningen på 
          <span className="block text-foreground font-bold text-lg mt-2">R {debtAmount.toFixed(2)}</span>
        </p>
        
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <div className="flex items-center justify-center gap-2 text-xs text-primary animate-pulse font-bold uppercase tracking-wider">
            Väntar på bekräftelse...
          </div>
          <Button variant="ghost" onClick={() => setStatus("idle")} className="mt-4 text-muted-foreground">
            Avbryt eller byt metod
          </Button>
        </div>
      </div>
    );
  }

  // 🛑 STATE: BLOCKED / IDLE (Val av betalmetod)
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-destructive/5 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border-2 border-border rounded-[3rem] p-8 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">Konto Pausat</h1>
          <p className="text-sm text-muted-foreground px-4">
            Skulden måste regleras för att du ska kunna se nya bud i appen.
          </p>
        </div>

        <div className="bg-muted/50 rounded-2xl p-6 mb-8 text-center border border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total skuld (6%)</p>
          <p className="text-4xl font-heading font-bold text-destructive">
             R {debtAmount.toFixed(2)}
          </p>
        </div>

        {/* Betalningsväljare */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {["M-Pesa", "MTN", "Airtel", "Card"].map((n) => (
            <button
              key={n}
              onClick={() => setMethod(n as any)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                method === n ? "border-primary bg-primary/5 shadow-inner" : "border-border bg-muted/30"
              }`}
            >
              {n === "Card" ? <CreditCard className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              <p className="text-[10px] font-black uppercase tracking-widest">{n}</p>
            </button>
          ))}
        </div>
        
        <Button 
          disabled={!method || status === "loading"} 
          onClick={handlePayment}
          className="w-full h-16 rounded-2xl text-lg font-bold shadow-glow bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {status === "loading" ? <Loader2 className="w-6 h-6 animate-spin" /> : "Betala Nu"}
        </Button>

        <div className="mt-8 flex items-center justify-center gap-4 text-xs font-bold text-muted-foreground">
          <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Säker betalning</span>
          <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Support</span>
        </div>
      </motion.div>
    </div>
  );
};

export default DriverBlockedScreen;
