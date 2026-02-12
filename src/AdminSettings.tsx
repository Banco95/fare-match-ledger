import { useState } from "react";
import { Save, Globe, ShieldAlert, Percent, Coins, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminSettings = () => {
  const [commission, setCommission] = useState(6);
  const [blockLimit, setBlockLimit] = useState(50);
  const [currency, setCurrency] = useState("ZAR");

  const handleSave = () => {
    // Here you would save these values to your database (e.g., Supabase/Firebase)
    toast.success("Global settings updated successfully!");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-heading font-bold mb-2">Platform Settings</h1>
          <p className="text-muted-foreground">Manage global commissions and driver eligibility rules.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 💰 Financial Rules */}
          <section className="space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Percent className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold">Commission Structure</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
                    Flat Rate Percentage (%)
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={commission}
                      onChange={(e) => setCommission(Number(e.target.value))}
                      className="w-full h-12 bg-muted border border-border rounded-xl px-4 font-bold"
                    />
                    <span className="absolute right-4 top-3 text-muted-foreground">%</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
                    Blocking Threshold ({currency})
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={blockLimit}
                      onChange={(e) => setBlockLimit(Number(e.target.value))}
                      className="w-full h-12 bg-muted border border-border rounded-xl px-4 font-bold"
                    />
                    <span className="absolute left-4 top-3 text-muted-foreground">{currency}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>Safety Gate:</strong> Drivers who exceed the threshold will be automatically redirected to the MoMo settlement screen and blocked from seeing new bids.
              </p>
            </div>
          </section>

          {/* 🌍 Localization Settings */}
          <section className="space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold">Regional Rules</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
                    Default Currency
                  </label>
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 font-bold outline-none"
                  >
                    <option value="ZAR">ZAR (South Africa)</option>
                    <option value="KES">KES (Kenya)</option>
                    <option value="UGX">UGX (Uganda)</option>
                    <option value="GHS">GHS (Ghana)</option>
                  </select>
                </div>

                <div className="p-4 bg-muted/50 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-foreground">
                    <Coins className="w-3 h-3" /> Active Payment Gateways
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["MTN MoMo", "Airtel Money", "M-Pesa"].map(m => (
                      <span key={m} className="px-3 py-1 bg-background border border-border rounded-full text-[10px] font-bold">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-12 pt-6 border-t border-border flex justify-end">
          <Button onClick={handleSave} size="lg" className="bg-primary text-white px-8 rounded-2xl font-bold shadow-glow">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default AdminSettings;
