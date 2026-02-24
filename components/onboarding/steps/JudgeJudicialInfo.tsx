"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { judgeJudicialSchema } from "@/lib/onboarding/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { COURT_LEVELS } from "@/lib/onboarding/constants";
import type { JudgeJudicialInfo as JudgeJudicialInfoType } from "@/lib/onboarding/types";

type FormValues = z.infer<typeof judgeJudicialSchema>;

interface JudgeJudicialInfoProps {
  data: JudgeJudicialInfoType;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
}

export function JudgeJudicialInfo({
  data,
  onSubmit,
  onBack,
}: JudgeJudicialInfoProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(judgeJudicialSchema),
    defaultValues: {
      courtLevel: data.courtLevel,
      designation: data.designation,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900">
          Tell us about your judicial role
        </h2>
        <p className="mt-2 text-gray-500">
          This helps us provide the right tools for your bench
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="courtLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Court Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select court level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COURT_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. District & Sessions Judge" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
