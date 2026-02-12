import { useState } from "react";
import { Globe, TrendingUp, DollarSign, Users, ArrowUpRight, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// 📊 Mockdata för globala intäkter
const regionStats = [
  { region: "South Africa", drivers: 1240, revenue: 45000, currency: "ZAR", growth: "+12%" },
  { region: "Kenya", drivers: 850, revenue: 320000, currency: "KES", growth: "+18%" },
  { region: "Nigeria", drivers: 620, revenue: 1200000, currency: "NGN", growth: "+25%" },
  { region: "Sweden", drivers: 145, revenue: 28000, currency: "SEK", growth: "+5%" },
  { region: "Germany", drivers: 95, revenue: 4200, currency: "EUR", growth: "+8%" },
];

const AdminGlobalLedger = () => {
  const [baseCurrency, setBaseCurrency] = useState("ZAR");

  return (
    <div className="min-h-screen bg-muted/20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
              <Globe className="w-8 h-8 text-primary" /> Global Dashboard
            </h1>
            <p className="text-muted-foreground font-medium">Realtidsöversikt av 6% provision från Afrika & Europa.</p>
          </div>
          <div className="flex gap-2 bg-card p-1 rounded-2xl border border-border">
            {["ZAR", "KES", "EUR", "USD"].map((curr) => (
              <Button
                key={curr}
                variant={baseCurrency === curr ? "default" : "ghost"}
                size="sm"
                onClick={() => setBaseCurrency(curr)}
                className="rounded-xl font-bold"
              >
                {curr}
              </Button>
            ))}
          </div>
        </header>

        {/* 📈 Huvudstatistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-glow">
            <p className="text-primary-foreground/80 font-bold uppercase tracking-widest text-xs mb-2">Total Provision (Globalt)</p>
            <h2 className="text-4xl font-heading font-bold mb-4">R 842,500</h2>
            <div className="flex items-center gap-2 text-sm font-bold bg-white/20 w-fit px-3 py-1 rounded-full">
              <ArrowUpRight className="w-4 h-4" /> +22% denna månad
            </div>
          </div>
          
          <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm">
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-2">Aktiva Förare</p>
            <h2 className="text-4xl font-heading font-bold mb-4 text-foreground">2,950</h2>
            <p className="text-sm text-emerald-600 font-bold tracking-tight">84 nya idag</p>
          </div>

          <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm">
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-2">Genomförda Resor</p>
            <h2 className="text-4xl font-heading font-bold mb-4 text-foreground">14.2K</h2>
            <p className="text-sm text-muted-foreground font-medium">Över 98 länder</p>
          </div>
        </div>

        {/* 🌍 Regional Uppdelning */}
        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2">
              <Map className="w-5 h-5" /> Intäkter per Region
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                  <th className="px-8 py-4">Land</th>
                  <th className="px-8 py-4 text-center">Förare</th>
                  <th className="px-8 py-4 text-right">Provision (Lokal)</th>
                  <th className="px-8 py-4 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {regionStats.map((item) => (
                  <tr key={item.region} className="hover:bg-muted/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-foreground">{item.region}</td>
                    <td className="px-8 py-6 text-center font-medium text-muted-foreground">{item.drivers.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right font-mono font-bold text-primary">
                      {item.currency} {item.revenue.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-xs">
                        {item.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGlobalLedger;
