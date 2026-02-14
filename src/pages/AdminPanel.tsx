import { useState } from "react";
import { Check, X, Eye, Users, DollarSign, Car, AlertTriangle, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

interface PaymentProof {
  id: string;
  driverName: string;
  amount: number;
  method: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  reference: string;
}

const mockPayments: PaymentProof[] = [
  { id: "p1", driverName: "James M.", amount: 850, method: "M-Pesa", submittedAt: "10 min ago", status: "pending", reference: "QK7R9X2B1" },
  { id: "p2", driverName: "Sarah K.", amount: 1200, method: "Bank Transfer", submittedAt: "25 min ago", status: "pending", reference: "TXN-20240115" },
  { id: "p3", driverName: "Peter O.", amount: 400, method: "M-Pesa", submittedAt: "1 hr ago", status: "approved", reference: "QK8T5M3A9" },
  { id: "p4", driverName: "Lucy A.", amount: 600, method: "Airtel Money", submittedAt: "2 hrs ago", status: "rejected", reference: "AIR-99281" },
];

const stats = [
  { label: "Active Drivers", value: "124", icon: Car, color: "text-primary" },
  { label: "Pending Payments", value: "8", icon: DollarSign, color: "text-warning" },
  { label: "Blocked Drivers", value: "3", icon: AlertTriangle, color: "text-destructive" },
  { label: "Total Riders", value: "892", icon: Users, color: "text-info" },
];

const AdminPanel = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const handleApprove = (id: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: "approved" as const } : p));
  };
  const handleReject = (id: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: "rejected" as const } : p));
  };

  const filtered = filter === "all" ? payments : payments.filter(p => p.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-heading font-bold text-gradient-primary">RideoBid</a>
          <span className="text-sm font-medium text-muted-foreground px-3 py-1 rounded-full bg-muted">Admin Panel</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl bg-card border border-border shadow-card"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Payment Verifications */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-heading font-bold text-foreground">Payment Verifications</h2>
          <div className="flex gap-2">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {payment.driverName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{payment.driverName}</p>
                  <p className="text-xs text-muted-foreground">{payment.method} · Ref: {payment.reference} · {payment.submittedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-heading font-bold text-foreground">KES {payment.amount}</span>
                {payment.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button variant="hero" size="sm" onClick={() => handleApprove(payment.id)}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleReject(payment.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === "approved" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>
                    {payment.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
