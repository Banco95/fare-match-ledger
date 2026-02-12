import { Lock, Smartphone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlockedScreenProps {
  debtAmount: number;
}

const DriverBlockedScreen = ({ debtAmount }: BlockedScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-destructive" />
      </div>

      <h1 className="text-2xl font-heading font-bold mb-2 text-foreground">Account Suspended</h1>
      <p className="text-muted-foreground text-sm max-w-xs mb-8">
        Your unpaid commission is **R {debtAmount.toFixed(2)}**, which exceeds the limit. 
        Please settle your balance to resume taking trips.
      </p>

      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-muted-foreground">Amount Owed</span>
          <span className="text-xl font-bold text-destructive">R {debtAmount.toFixed(2)}</span>
        </div>
        
        <div className="space-y-3">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl">
            <Smartphone className="w-4 h-4 mr-2" /> Pay via MTN / Vodacom MoMo
          </Button>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-4">
            Secured by Paystack
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverBlockedScreen;
