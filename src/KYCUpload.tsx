import { useState } from "react";
import { Upload, FileCheck, ShieldAlert, Camera, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const KYCUpload = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState<"id_front" | "id_back" | "submitting" | "pending">("id_front");
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const proceed = () => {
    if (step === "id_front") {
      setImage(null);
      setStep("id_back");
    } else {
      setStep("submitting");
      // Simulate API upload to Supabase/Cloudinary
      setTimeout(() => setStep("pending"), 3000);
    }
  };

  if (step === "pending") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <FileCheck className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-heading font-bold mb-2">Verification Pending</h1>
        <p className="text-muted-foreground text-sm max-w-xs mb-8">
          Our team is verifying your South African ID. This usually takes 2–4 hours.
        </p>
        <Button onClick={onComplete} variant="outline" className="w-full rounded-2xl h-14">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-10 text-center">
        <h1 className="text-2xl font-heading font-bold mb-2">Identify Verification</h1>
        <p className="text-muted-foreground text-sm">Upload your SA ID or Passport to start earning.</p>
      </header>

      <div className="max-w-md mx-auto space-y-8">
        {/* ID Template View */}
        <div className="relative aspect-[1.6/1] bg-card border-2 border-dashed border-border rounded-3xl overflow-hidden flex flex-col items-center justify-center group">
          {image ? (
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {step === "id_front" ? "Front of ID Card" : "Back of ID Card"}
              </p>
            </div>
          )}
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Ensure all details are readable and the card is within the frame. Blurred photos will be rejected.
          </p>
        </div>

        <Button 
          disabled={!image || step === "submitting"}
          onClick={proceed}
          className="w-full h-16 rounded-2xl text-lg font-bold shadow-glow"
        >
          {step === "submitting" ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            `Upload ${step === "id_front" ? "Front" : "Back"}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default KYCUpload;
