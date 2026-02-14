import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Car, Users, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import FeaturesSection from "../components/FeaturesSection";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 w-full z-50 glass-surface border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-heading font-bold text-gradient-primary">RideoBid</span>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/rider" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Ride</Link>
            <Link to="/driver" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Drive</Link>
            <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/rider">
              <Button variant="outline-hero" size="sm">I'm a Rider</Button>
            </Link>
            <Link to="/driver">
              <Button variant="hero" size="sm">I'm a Driver</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        </div>
        <div className="container mx-auto px-4 relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm border border-primary/30">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              Live P2P Bidding
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground mb-6 leading-tight">
              Your Ride,{" "}
              <span className="text-gradient-accent">Your Price.</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg leading-relaxed">
              Post your trip. Get bids from nearby drivers. Pick the best deal. Pay cash or mobile money — no middleman.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/rider">
                <Button variant="hero" size="xl">
                  Request a Ride <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/driver">
                <Button variant="outline-hero" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  Start Driving
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-lg"
          >
            {[
              { icon: Car, label: "Active Drivers", value: "120+" },
              { icon: Users, label: "Happy Riders", value: "890+" },
              { icon: Shield, label: "Trips Completed", value: "3.2K" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-primary-foreground/60 mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-xs text-primary-foreground/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <FeaturesSection />

      {/* CTA */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
            Ready to ride on your terms?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Join the marketplace where riders and drivers negotiate fair prices directly.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/rider">
              <Button variant="hero" size="xl">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-heading font-bold text-gradient-primary">RideoBid</span>
          <p className="text-sm text-muted-foreground">© 2026 RideoBid. Fair rides, fair prices.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
