import { useState } from "react";
import { Camera, ShieldCheck, Loader2, CheckCircle2, UserCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type KYCStep = "ID_FRONT" | "ID_BACK" | "SELFIE_WITH_ID" | "FACE_CLOSEUP" | "PROCESSING" | "SUCCESS";

const KYCUpload = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState<KYCStep>("ID_FRONT");
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const stepInfo = {
    ID_FRONT: { title: "ID Front", desc: "Clear photo of the front of your South African ID" },
    ID_BACK: { title: "ID Back", desc: "Clear photo of the back of your ID card" },
    SELFIE_WITH_ID: { title: "ID Selfie", desc: "Hold your ID clearly next to your face" },
    FACE_CLOSEUP: { title: "Live Face", desc: "A clear photo of your face looking forward" },
  };

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploads(prev => ({ ...prev, [currentStep]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = async () => {
    setIsUploading(true);
    
    // Simulating progress
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsUploading(false);

    if (currentStep === "ID_FRONT") setCurrentStep("ID_BACK");
    else if (currentStep === "ID_BACK") setCurrentStep("SELFIE_WITH_ID");
    else if (currentStep === "SELFIE_WITH_ID") setCurrentStep("FACE_CLOSEUP");
    else handleFinalSubmit();
  };

  const handleFinalSubmit = async () => {
    setCurrentStep("PROCESSING");
    
    // --- 🤖 AUTO-VERIFICATION LOGIC ---
    // In a production app, you would send these 4 images to an AI Service:
    // 1. OCR: Extract name/ID number from ID_FRONT.
    // 2. Facial Match: Compare FACE_CLOSEUP with the photo on ID_FRONT.
    // 3. Liveness Check: Compare SELFIE_WITH_ID to FACE_CLOSEUP.
    
    setTimeout(() => {
      setCurrentStep("SUCCESS");
      toast.success("AI Verification Successful!");
    }, 4000);
  };

  if (currentStep === "PROCESSING") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-6">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <h2 className="text-2xl font-heading font-bold">Auto-Verifying...</h2>
        <p className="text-muted-foreground text-sm">Our AI is matching your selfie with your South African ID details.</p>
      </div>
    );
  }

  if (currentStep === "SUCCESS") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-heading font-bold">Verified!</h2>
        <p className="text-muted-foreground">Your identity has been confirmed. Welcome to RideoBid.</p>
        <Button onClick={onComplete} className="w-full max-w-xs h-14 rounded-2xl font-bold">Start Earning</Button>
      </div>
    );
  }

  const activeStepData = stepInfo[currentStep as keyof typeof stepInfo];

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-heading font-bold">KYC Verification</h1>
          <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">Step {Object.keys(uploads).length + 1} of 4</span>
        </div>
        <p className="text-muted-foreground text-sm">{activeStepData.desc}</p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-sm aspect-[3/4] bg-card border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden">
          {uploads[currentStep] ? (
            <img src={uploads[currentStep]} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              {currentStep === "SELFIE_WITH_ID" ? <UserCheck className="w-16 h-16 mx-auto mb-4 text-primary/40" /> : <Smartphone className="w-16 h-16 mx-auto mb-4 text-primary/40" />}
              <p className="text-xs font-bold uppercase text-muted-foreground">Tap to take photo</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            capture="user" 
            onChange={handleCapture}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <footer className="mt-8 space-y-3">
        <Button 
          disabled={!uploads[currentStep] || isUploading}
          onClick={nextStep}
          className="w-full h-16 rounded-2xl text-lg font-bold shadow-glow"
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
        </Button>
        <p className="text-[10px] text-center text-muted-foreground font-medium uppercase">
          <ShieldCheck className="w-3 h-3 inline mr-1" /> Secure encrypted upload
        </p>
      </footer>
    </div>
  );
};

export default KYCUpload;
