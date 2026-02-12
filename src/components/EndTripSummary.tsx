import React from 'react';
import { AlertCircle, ArrowRight, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EndTripSummary({ tripAmount, onConfirm }: { tripAmount: number, onConfirm: () => void }) {
  const fee = tripAmount * 0.06;
  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Trip Completed</CardTitle>
        <h2 className="text-4xl font-heading font-bold text-foreground mt-2 text-center">R {tripAmount.toFixed(2)}</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between p-3 bg-muted rounded-xl text-sm">
          <span>Platform Fee (6%)</span>
          <span className="font-bold text-destructive">- R {fee.toFixed(2)}</span>
        </div>
        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-[11px] text-amber-800">Fee added to ledger. Settle via MoMo before reaching R50.</p>
        </div>
        <Button onClick={onConfirm} className="w-full bg-emerald-600 text-white h-12 rounded-xl font-bold">
          Confirm & Next Trip <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
