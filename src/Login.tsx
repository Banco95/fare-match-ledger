import { useState } from "react";
import { Smartphone, ArrowRight, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState<'ZA' | 'KE'>('ZA');

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 justify-between">
      <div className="mt-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-heading font-bold tracking-tighter">RideoBid</h1>
        </motion.div>

        <h2 className="text-4xl font-heading font-bold mb-4">Välkommen tillbaka</h2>
        <p className="text-muted-foreground mb-10">Ange ditt mobilnummer för att logga in eller skapa ett konto.</p>

        <div className="space-y-4">
          {/* Landväljare */}
          <div className="flex gap-2 p-1 bg-muted rounded-2xl">
            <button 
              onClick={() => setCountry('ZA')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${country === 'ZA' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`}
            >
              🇿🇦 Sydafrika
            </button>
            <button 
              onClick={() => setCountry('KE')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${country === 'KE' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`}
            >
              🇰🇪 Kenya
            </button>
          </div>

          {/* Telefonnummer Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 font-bold text-sm border-r pr-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span>{country === 'ZA' ? '+27' : '+254'}</span>
            </div>
            <input 
              type="tel"
              placeholder="000 000 000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full h-16 pl-24 pr-6 bg-card border border-border rounded-2xl text-lg font-bold outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-[11px] text-center text-muted-foreground px-6 leading-relaxed">
          Genom att fortsätta godkänner du våra användarvillkor och bekräftar att du är över 18 år.
        </p>
        
        <Button 
          disabled={phoneNumber.length < 7}
          className="w-full h-16 rounded-2xl text-lg font-bold shadow-glow flex items-center justify-center gap-3"
        >
          Fortsätt <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Login;
