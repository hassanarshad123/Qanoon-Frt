"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { comingSoonEmailSchema } from "@/lib/onboarding/schemas";
import { submitComingSoonEmail } from "@/lib/onboarding/submit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { ArrowLeft, Bell, CheckCircle2, Loader2 } from "lucide-react";

type FormValues = z.infer<typeof comingSoonEmailSchema>;

interface ComingSoonViewProps {
  role: "law_student" | "common_person";
  onBack: () => void;
}

const roleLabels = {
  law_student: "Law Students",
  common_person: "Citizens",
};

export function ComingSoonView({ role, onBack }: ComingSoonViewProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(comingSoonEmailSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    const result = await submitComingSoonEmail(role, data.email);
    setIsLoading(false);

    if (result.success) {
      setSubmitted(true);
      toast.success("You're on the list!", {
        description: "We'll notify you as soon as it's ready.",
      });
    } else {
      const msg = result.error ?? "Something went wrong. Please try again.";
      setError(msg);
      toast.error("Signup failed", { description: msg });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
      <div className="w-16 h-16 rounded-2xl bg-[#A21CAF]/10 flex items-center justify-center">
        <Bell className="w-8 h-8 text-[#A21CAF]" />
      </div>

      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900">
          Coming Soon for {roleLabels[role]}
        </h2>
        <p className="mt-3 text-gray-500 max-w-md mx-auto">
          We&apos;re building something special for you. Leave your email and
          we&apos;ll notify you as soon as it&apos;s ready.
        </p>
      </div>

      {submitted ? (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-6 py-3 rounded-lg">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">
            Thank you! We&apos;ll be in touch soon.
          </span>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 w-full max-w-sm"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#A21CAF] hover:bg-[#86198F] text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Notify Me"
              )}
            </Button>
          </form>
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </Form>
      )}

      <Button
        variant="ghost"
        onClick={onBack}
        className="gap-2 text-gray-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to role selection
      </Button>
    </div>
  );
}
