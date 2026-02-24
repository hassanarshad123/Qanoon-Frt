"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { personalInfoSchema } from "@/lib/onboarding/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, ArrowRight, Scale } from "lucide-react";
import type { PersonalInfo as PersonalInfoType } from "@/lib/onboarding/types";

type FormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoProps {
  data: PersonalInfoType;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  emailReadOnly?: boolean;
}

export function PersonalInfo({ data, onSubmit, onBack, emailReadOnly }: PersonalInfoProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
          <Scale className="w-5 h-5 text-accent-dynamic" />
        </div>
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900">
            Let&apos;s get to know you
          </h2>
          <p className="mt-1 text-gray-500">
            Your basic details help us personalize your experience
          </p>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Muhammad Ahmed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        readOnly={emailReadOnly}
                        className={emailReadOnly ? "bg-gray-50 text-gray-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="03001234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="gap-2 text-white bg-accent-dynamic hover:bg-accent-hover transition-colors"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
