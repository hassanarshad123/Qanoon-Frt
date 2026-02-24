"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-emerald-700 text-white text-center py-2 px-4 text-sm">
      <span className="font-medium">
        Pakistan&apos;s First AI-Powered Legal Intelligence Platform is now live!
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
