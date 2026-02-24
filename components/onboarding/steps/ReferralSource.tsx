"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { referralSchema } from "@/lib/onboarding/schemas";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  ArrowLeft,
  Check,
  Search,
  Share2,
  UserCheck,
  Award,
  Calendar,
  Newspaper,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { REFERRAL_SOURCES } from "@/lib/onboarding/constants";
import type { ReferralInfo } from "@/lib/onboarding/types";

type FormValues = z.infer<typeof referralSchema>;

const REFERRAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Search Engine (Google, etc.)": Search,
  "Social Media": Share2,
  "Colleague / Friend": UserCheck,
  "Bar Association": Award,
  "Legal Conference / Event": Calendar,
  "News Article / Blog": Newspaper,
  Other: MoreHorizontal,
};

interface ReferralSourceProps {
  data: ReferralInfo;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
}

export function ReferralSource({ data, onSubmit, onBack }: ReferralSourceProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      source: data.source,
      otherDetail: data.otherDetail,
    },
  });

  const selectedSource = form.watch("source");

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-accent-dynamic" />
        </div>
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900">
            One last thing
          </h2>
          <p className="mt-1 text-gray-500">
            How did you hear about QanoonAI? (Optional)
          </p>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                      >
                        {REFERRAL_SOURCES.map((source) => {
                          const Icon = REFERRAL_ICONS[source] || MoreHorizontal;
                          const isSelected = field.value === source;
                          return (
                            <FormItem key={source} className="space-y-0">
                              <FormControl>
                                <RadioGroupItem value={source} className="sr-only" />
                              </FormControl>
                              <FormLabel
                                className={cn(
                                  "flex items-center gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all",
                                  "hover:shadow-sm active:scale-[0.98]",
                                  isSelected
                                    ? "border-accent-dynamic bg-accent-light text-accent-dynamic"
                                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                    isSelected ? "bg-accent-dynamic text-white" : "bg-gray-100 text-gray-500"
                                  )}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">{source}</span>
                              </FormLabel>
                            </FormItem>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedSource === "Other" && (
                <FormField
                  control={form.control}
                  name="otherDetail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Please specify</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more..."
                          className="resize-none"
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
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onSubmit({ source: "", otherDetail: "" })}
                  >
                    Skip
                  </Button>
                  <Button
                    type="submit"
                    className="gap-2 text-white bg-accent-dynamic hover:bg-accent-hover transition-colors"
                  >
                    Complete
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
