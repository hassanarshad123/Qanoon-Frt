import { SignupFlow } from "@/components/auth/SignupFlow";
import { Toaster } from "@/components/ui/sonner";

export default function SignupPage() {
  return (
    <>
      <SignupFlow />
      <Toaster richColors />
    </>
  );
}
