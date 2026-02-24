"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { lawStudentInterestsSchema } from "@/lib/onboarding/schemas";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ArrowLeft, Check } from "lucide-react";
import { PRACTICE_AREAS, CAREER_GOALS } from "@/lib/onboarding/constants";
import type { LawStudentInterests } from "@/lib/onboarding/types";

type FormValues = z.infer<typeof lawStudentInterestsSchema>;

interface StudentInterestsProps {
  data: LawStudentInterests;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
}

export function StudentInterests({ data, onSubmit, onBack }: StudentInterestsProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(lawStudentInterestsSchema),
    defaultValues: {
      areasOfInterest: data.areasOfInterest,
      careerGoal: data.careerGoal,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900">
          What areas of law excite you?
        </h2>
        <p className="mt-2 text-gray-500">
          This helps us personalize your study resources
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="areasOfInterest"
            render={() => (
              <FormItem>
                <FormLabel>Areas of Interest</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {PRACTICE_AREAS.map((area) => (
                    <FormField
                      key={area}
                      control={form.control}
                      name="areasOfInterest"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(area)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                field.onChange(
                                  checked
                                    ? [...current, area]
                                    : current.filter((v: string) => v !== area)
                                );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            {area}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="careerGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Career Goal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="What do you want to do after graduation?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CAREER_GOALS.map((goal) => (
                      <SelectItem key={goal} value={goal}>
                        {goal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              Complete
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
