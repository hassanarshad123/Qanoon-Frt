"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { citizenConcernSchema } from "@/lib/onboarding/schemas";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LEGAL_CONCERN_AREAS } from "@/lib/onboarding/constants";
import { cn } from "@/lib/utils/cn";
import type { CitizenConcern as CitizenConcernType } from "@/lib/onboarding/types";

type FormValues = z.infer<typeof citizenConcernSchema>;

interface CitizenConcernProps {
  data: CitizenConcernType;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
}

export function CitizenConcern({ data, onSubmit, onBack }: CitizenConcernProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(citizenConcernSchema),
    defaultValues: {
      concernArea: data.concernArea,
      briefDescription: data.briefDescription,
    },
  });

  const selectedArea = form.watch("concernArea");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900">
          How can we help you?
        </h2>
        <p className="mt-2 text-gray-500">
          Select the area of law that concerns you
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="concernArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Concern Area</FormLabel>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {LEGAL_CONCERN_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => field.onChange(area)}
                      className={cn(
                        "p-3 rounded-lg border-2 text-left text-sm font-medium transition-all",
                        field.value === area
                          ? "border-accent-dynamic bg-accent-light text-accent-dynamic"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {area}
                    </button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedArea && (
            <FormField
              control={form.control}
              name="briefDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brief Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a bit more about your situation..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex items-center justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="gap-2">
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
    </div>
  );
}
