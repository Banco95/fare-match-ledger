import { Car, MapPin, DollarSign, Shield, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Car,
    title: "P2P Bidding",
    description: "Riders post trips, drivers bid. You choose the best price — no middleman algorithms.",
  },
  {
    icon: MapPin,
    title: "Geofenced Matching",
    description: "Only drivers within 5km see your request. Fast, local, and relevant.",
  },
  {
    icon: DollarSign,
    title: "Cash & Mobile Money",
    description: "Pay your driver directly — cash or mobile money. No card needed.",
  },
  {
    icon: Shield,
    title: "Commission Ledger",
    description: "Transparent 6% platform fee tracked in real-time. Drivers manage their wallet.",
  },
  {
    icon: Users,
    title: "Driver Ratings",
    description: "Community-driven trust. Rate drivers and build a reliable network.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "Instant bid notifications. No refreshing — bids appear live.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A fair marketplace where riders and drivers negotiate directly.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
