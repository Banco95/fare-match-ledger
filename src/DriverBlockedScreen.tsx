import { useState } from "react";
import { Lock, Smartphone, Loader2, CheckCircle2, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface BlockedScreenProps {
  debtAmount: number;
  onUnlock: () => void; // Call this to reset debt in parent
}

const DriverBlockedScreen = ({ debtAmount, onUnlock }: BlockedScreenProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "success">("idle");
  const [method, setMethod] = useState<"MTN" | "Airtel" | "M-Pesa" | null>(null);

  const handlePayment = () => {
    setStatus("loading");
    // Simulates the trigger of the STK Push
    setTimeout(() => {
      setStatus("sent");
      
      // Simulation: After 4 seconds, pretend the driver entered their PIN
      setTimeout(() => {
        setStatus("success");
      }, 4000);
    }, 1500);
  };

  // ✅ STATE 3: PAYMENT CONFIRMED (SUCCESS)
  if (status === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: "spring", damping: 12 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-3xl font-heading font-bold mb-2">Payment Confirmed!</h1>
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold mb-8">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest">Account Active</span>
          </div>

          <p className="text-muted-foreground text-sm max-w-xs mb-10">
            Your commission has been settled. You are now authorized to receive new ride requests.
          </p>

          <Button 
            onClick={onUnlock}
            className="w-full bg-foreground text-background h-14 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            Go to Live Bids <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    );
  }

  // 📲 STATE 2: REQUEST SENT (WAITING FOR PIN)
  if (status === "sent") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-heading font-bold mb-2 tracking-tight">Check Your Phone</h1>
        <p className="text-muted-foreground text-sm max-w-xs mb-8">
          We've sent a **{method}** prompt. Enter your PIN to pay **R {debtAmount.toFixed(2)}**.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <div className="flex items-center justify-center gap-2 text-xs text-primary animate-pulse font-bold">
            <Loader2 className="w-3 h-3 animate-spin" /> Waiting for confirmation...
          </div>
          <Button variant="outline" onClick={() => setStatus("idle")} className="rounded-xl border-border">
            Try a different method
          </Button>
        </div>
      </div>
    );
  }

  // 🛑 STATE 1: BLOCKED (NETWORK SELECTION)
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-destructive" />
      </div>

      <h1 className="text-2xl font-heading font-bold mb-2">Account Suspended</h1>
      <p className="text-muted-foreground text-sm max-w-xs mb-8">
        Commission debt: **R {debtAmount.toFixed(2)}**. Settle via MoMo to continue.
      </p>

      <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-sm">
        <div className="grid grid-cols-3 gap-2 mb-6">
          {["MTN", "Airtel", "M-Pesa"].map((n) => (
            <button
              key={n}
              onClick={() => setMethod(n as any)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                method === n ? "border-primary bg-primary/10" : "border-border bg-muted/50"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${method === n ? "bg-primary" : "bg-muted-foreground/30"}`} />
              <p className="text-[10px] font-black uppercase tracking-tighter">{n}</p>
            </button>
          ))}
        </div>
        
        <Button 
          disabled={!method || status === "loading"} 
          onClick={handlePayment}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-2xl font-bold shadow-lg shadow-emerald-900/10"
        >
          {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Settle Now"}
        </Button>
      </div>
    </div>
  );
};

export default DriverBlockedScreen;
