import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DriverDashboard from "./pages/DriverDashboard";
import RiderCreateRequest from "./pages/RiderCreateRequest";
import RiderMatchSuccess from "./pages/RiderMatchSuccess";
import RiderTripProgress from "./pages/RiderTripProgress";
import AdminVerificationQueue from "./AdminVerificationQueue";
import { SettingsProvider } from "./contexts/SettingsContext";

function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            {/* Startsidan som du ser på din skärmbild */}
            <Route path="/" element={<Index />} />
            
            {/* Inloggning för både Rider & Driver */}
            <Route path="/login" element={<Login />} />

            {/* FÖRAR-FLÖDE */}
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            
            {/* PASSAGERAR-FLÖDE */}
            <Route path="/rider-setup" element={<RiderCreateRequest />} />
            <Route path="/match-found" element={<RiderMatchSuccess />} />
            <Route path="/trip-active" element={<RiderTripProgress />} />

            {/* ADMIN-FLÖDE (Där du verifierar ID:n) */}
            <Route path="/admin/verify" element={<AdminVerificationQueue />} />
          </Routes>
          
          {/* Globala notiser för betalningar och KYC-status */}
          <Toaster position="top-center" richColors />
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
