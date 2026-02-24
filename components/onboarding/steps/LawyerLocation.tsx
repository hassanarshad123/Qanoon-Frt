"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { lawyerLocationSchema } from "@/lib/onboarding/schemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { PROVINCES, CITIES_BY_PROVINCE } from "@/lib/onboarding/constants";
import type { LawyerLocation as LawyerLocationType } from "@/lib/onboarding/types";

type FormValues = z.infer<typeof lawyerLocationSchema>;

interface LawyerLocationProps {
  data: LawyerLocationType;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
}

export function LawyerLocation({ data, onSubmit, onBack }: LawyerLocationProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(lawyerLocationSchema),
    defaultValues: {
      province: data.province,
      city: data.city,
      primaryCourt: data.primaryCourt,
    },
  });

  const selectedProvince = form.watch("province");
  const cities = selectedProvince ? CITIES_BY_PROVINCE[selectedProvince] || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-accent-dynamic" />
        </div>
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900">
            Where do you practice?
          </h2>
          <p className="mt-1 text-gray-500">
            Help us connect you with local legal resources
          </p>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province / Territory</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("city", "");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROVINCES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
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
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedProvince}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={selectedProvince ? "Select city" : "Select province first"}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="primaryCourt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Court</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Lahore High Court" {...field} />
                    </FormControl>
                    <FormDescription>
                      This helps us surface relevant local case law and schedules
                    </FormDescription>
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
