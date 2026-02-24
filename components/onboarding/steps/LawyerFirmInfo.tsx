"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { lawyerFirmSchema } from "@/lib/onboarding/schemas";
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
  FormDescription,
} from "@/components/ui/form";
import { ArrowLeft, ArrowRight, Building, User, Users, Building2, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { FIRM_TYPES } from "@/lib/onboarding/constants";
import type { LawyerFirmInfo as LawyerFirmInfoType } from "@/lib/onboarding/types";

type FormValues = z.infer<typeof lawyerFirmSchema>;

const FIRM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  solo: User,
  small: Users,
  medium: Building,
  large: Building2,
  in_house: Briefcase,
};

interface LawyerFirmInfoProps {
  data: LawyerFirmInfoType;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
}

export function LawyerFirmInfo({ data, onSubmit, onBack }: LawyerFirmInfoProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(lawyerFirmSchema),
    defaultValues: {
      firmType: data.firmType,
      firmName: data.firmName,
    },
  });

  const selectedType = form.watch("firmType");

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
          <Building className="w-5 h-5 text-accent-dynamic" />
        </div>
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900">
            Tell us about your firm
          </h2>
          <p className="mt-1 text-gray-500">
            What kind of practice setup do you have?
          </p>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="firmType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firm Type</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {FIRM_TYPES.map((type) => {
                        const Icon = FIRM_ICONS[type.value] || Building;
                        const isSelected = field.value === type.value;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => field.onChange(type.value)}
                            className={cn(
                              "flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all",
                              "hover:shadow-sm active:scale-[0.98]",
                              isSelected
                                ? "border-accent-dynamic bg-accent-light text-accent-dynamic"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <div
                              className={cn(
                                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                isSelected ? "bg-accent-dynamic text-white" : "bg-gray-100 text-gray-500"
                              )}
                            >
                              <Icon className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-sm font-medium">
                              {type.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <FormDescription>
                      We&apos;ll customize features based on your firm&apos;s size and needs
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedType && selectedType !== "solo" && (
                <FormField
                  control={form.control}
                  name="firmName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firm Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Ahmed & Associates" {...field} />
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
        </CardContent>
      </Card>
    </div>
  );
}
