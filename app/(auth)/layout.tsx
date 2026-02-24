import { Scale } from "lucide-react";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#A21CAF]" />
          <span className="text-xl font-semibold text-gray-900 tracking-tight">QanoonAI</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <Toaster />
    </div>
  );
}
