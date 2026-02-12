import { useState } from "react";
import { 
  Lock, AlertCircle, Smartphone, ArrowRight, 
  Loader2, CheckCircle, ShieldCheck, HelpCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface BlockedScreenProps {
  debtAmount: number;
  onUnlock: () => void; // För demo/lokal reset
  onMomoPay: (amount: number, provider: 'MTN' | 'AIRTEL' | 'MPESA') => Promise<void>;
}

const DriverBlockedScreen = ({ debtAmount, onUnlock, onMomoPay }: BlockedScreenProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "success">("idle");
  const [method, setMethod] = useState<'MTN' | 'AIRTEL' | 'MPESA' | null>(null);

  const handlePaymentClick = async () => {
    if (!method) return;
    
    setStatus("loading");
    try {
      await onMomoPay(debtAmount, method);
      setStatus("sent");
      
      // I en riktig app väntar vi här på att Supabase Realtime 
      // ska uppdatera skulden till 0. För demo simulerar vi framgång:
      /* setTimeout(() => {
        setStatus("success");
      }, 5000); 
      */
    } catch (error) {
      setStatus("idle");
    }
  };

  // ✅ STATE: SUCCESS (Visas när betalningen är bekräftad)
  if (status === "success") {
    return (
      <div className="fixed inset-0 z-[110] bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black mb-3 italic tracking-tighter">BETALD!</h1>
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold mb-8">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-[0.2em]">Konto Aktiverat</span>
          </div>
          <Button 
            onClick={onUnlock}
            className="w-full bg-foreground text-background h-16 rounded-2xl text-lg font-bold flex items-center justify-center gap-3"
          >
            Se nya bud <ArrowRight className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    );
  }

  // 📲 STATE: SENT (Väntar på PIN-kod från föraren)
  if (status === "sent") {
    return (
      <div className="fixed inset-0 z-[110] bg-background flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-emerald-500" />
          </div>
          <Loader2 className="absolute -top-1 -right-1 w-6 h-6 text-emerald-500 animate-spin" />
        </div>
        
        <h1 className="text-2xl font-black mb-4 uppercase">Kolla telefonen</h1>
        <p className="text-muted-foreground text-sm max-w-xs mb-10 leading-relaxed">
          Vi har skickat en begäran till din <span className="font-bold text-foreground">{method}</span>. 
          Ange din PIN-kod för att godkänna provisionen på:
          <span className="block text-primary font-black text-3xl mt-4">R {debtAmount.toFixed(2)}</span>
        </p>
        
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <div className="text-[10px] text-primary animate-pulse font-black uppercase tracking-widest">
            Väntar på operatörs-bekräftelse...
          </div>
          <Button variant="ghost" onClick={() => setStatus("idle")} className="mt-4 text-muted-foreground font-bold">
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
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Körning Pausad</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Betala provisionen för din senaste resa för att fortsätta tjäna pengar.
          </p>
        </div>

        <div className="bg-muted/50 rounded-2xl p-6 mb-8 text-center border border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Provision att betala</p>
          <p className="text-4xl font-black text-foreground">
             R {debtAmount.toFixed(2)}
          </p>
        </div>

        {/* Mobile Money Selector */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {(['MPESA', 'MTN', 'AIRTEL'] as const).map((n) => (
            <button
              key={n}
              onClick={() => setMethod(n)}
              className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                method === n ? "border-primary bg-primary/5" : "border-border bg-muted/30"
              }`}
            >
              <Smartphone className={`w-5 h-5 ${method === n ? "text-primary" : "text-muted-foreground"}`} />
              <p className="text-[9px] font-black uppercase tracking-tighter">{n}</p>
            </button>
          ))}
        </div>
        
        <Button 
          disabled={!method || status === "loading"} 
          onClick={handlePaymentClick}
          className="w-full h-16 rounded-2xl text-lg font-black shadow-glow bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-tight"
        >
          {status === "loading" ? <Loader2 className="w-6 h-6 animate-spin" /> : `Betala med ${method || 'Momo'}`}
        </Button>

        <div className="mt-8 flex items-center justify-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Säker</span>
          <span className="flex items-center gap-1 underline cursor-pointer"><HelpCircle className="w-3 h-3" /> Support</span>
        </div>
      </motion.div>
    </div>
  );
};

export default DriverBlockedScreen;
