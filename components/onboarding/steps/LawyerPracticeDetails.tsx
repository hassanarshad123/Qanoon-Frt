"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { lawyerPracticeSchema } from "@/lib/onboarding/schemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PRACTICE_AREAS, EXPERIENCE_RANGES } from "@/lib/onboarding/constants";
import type { LawyerPracticeDetails as LawyerPracticeDetailsType } from "@/lib/onboarding/types";

type FormValues = z.infer<typeof lawyerPracticeSchema>;

interface LawyerPracticeDetailsProps {
  data: LawyerPracticeDetailsType;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
}

export function LawyerPracticeDetails({
  data,
  onSubmit,
  onBack,
}: LawyerPracticeDetailsProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(lawyerPracticeSchema),
    defaultValues: {
      barCouncilNumber: data.barCouncilNumber,
      yearsOfExperience: data.yearsOfExperience,
      practiceAreas: data.practiceAreas,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5 text-accent-dynamic" />
        </div>
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900">
            Tell us about your practice
          </h2>
          <p className="mt-1 text-gray-500">
            This helps us tailor your legal tools
          </p>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="barCouncilNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bar Council Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. LHC/2020/1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EXPERIENCE_RANGES.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
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
                name="practiceAreas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Practice Areas</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {PRACTICE_AREAS.map((area) => {
                        const isSelected = field.value?.includes(area);
                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => {
                              const current = field.value || [];
                              field.onChange(
                                isSelected
                                  ? current.filter((v: string) => v !== area)
                                  : [...current, area]
                              );
                            }}
                            className={cn(
                              "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all",
                              "hover:shadow-sm active:scale-[0.97]",
                              isSelected
                                ? "bg-accent-dynamic text-white border-accent-dynamic shadow-sm"
                                : "bg-white text-gray-600 border-gray-200"
                            )}
                          >
                            {area}
                          </button>
                        );
                      })}
                    </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
