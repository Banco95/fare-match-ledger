import { motion } from "framer-motion";
import { Phone, MessageCircle, Star, Car, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";

const RiderMatchSuccess = () => {
  // Mock data for the accepted driver
  const driver = {
    name: "Sipho",
    rating: 4.9,
    trips: 1240,
    car: "Toyota Corolla",
    plate: "BZ 44 LP GP",
    color: "Silver",
    bidAccepted: 420.00
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 🎉 Success Header */}
      <div className="bg-emerald-600 p-8 pt-12 text-white text-center rounded-b-[3rem] shadow-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <ShieldCheck className="w-10 h-10" />
        </motion.div>
        <h1 className="text-2xl font-heading font-bold mb-1">Driver Found!</h1>
        <p className="text-emerald-100 text-sm">Sipho accepted your bid of R {driver.bidAccepted.toFixed(2)}</p>
      </div>

      <main className="container max-w-md mx-auto p-6 -mt-8">
        {/* 📇 Driver Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-6 shadow-xl mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl">S</div>
              </div>
              <div>
                <h2 className="text-xl font-bold">{driver.name}</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1 text-accent font-bold">
                    <Star className="w-3 h-3 fill-current" /> {driver.rating}
                  </span>
                  <span className="text-muted-foreground">· {driver.trips} trips</span>
                </div>
              </div>
            </div>
            <div className="bg-primary/10 p-3 rounded-2xl text-primary">
              <Car className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-border mb-6">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Vehicle</p>
              <p className="font-bold text-sm">{driver.color} {driver.car}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">License Plate</p>
              <p className="font-bold text-sm">{driver.plate}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-12 rounded-xl border-border gap-2">
              <MessageCircle className="w-4 h-4" /> Message
            </Button>
            <Button variant="outline" className="flex-1 h-12 rounded-xl border-border gap-2">
              <Phone className="w-4 h-4" /> Call
            </Button>
          </div>
        </motion.div>

        {/* 📍 Status Update */}
        <div className="bg-muted/30 rounded-2xl p-4 border border-border flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
             <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Status</p>
            <p className="text-sm font-medium">Driver is 3 mins away from pickup</p>
          </div>
        </div>

        <Button 
          variant="ghost" 
          className="w-full mt-6 text-destructive font-bold hover:bg-destructive/5"
        >
          Cancel Ride
        </Button>
      </main>
    </div>
  );
};

export default RiderMatchSuccess;
