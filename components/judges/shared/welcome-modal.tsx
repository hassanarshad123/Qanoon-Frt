"use client";

import { Scale } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
  name: string;
  open: boolean;
  onStartTour: () => void;
  onSkip: () => void;
}

export function WelcomeModal({ name, open, onStartTour, onSkip }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onSkip()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-[#A21CAF]/10 flex items-center justify-center mb-3">
            <Scale className="h-7 w-7 text-[#A21CAF]" />
          </div>
          <DialogTitle className="text-xl">
            Welcome, {name}!
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-2">
            Your AI-powered judicial workspace is ready. Let us give you a quick
            tour of all the tools available to you.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={onSkip} className="flex-1">
            Skip for now
          </Button>
          <Button
            onClick={onStartTour}
            className="bg-[#A21CAF] hover:bg-[#86198F] text-white flex-1"
          >
            Start Tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
