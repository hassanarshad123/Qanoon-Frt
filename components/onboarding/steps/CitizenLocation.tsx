"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { citizenLocationSchema } from "@/lib/onboarding/schemas";
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
import { ArrowLeft, Check } from "lucide-react";
import { PROVINCES, CITIES_BY_PROVINCE } from "@/lib/onboarding/constants";
import type { CitizenLocation as CitizenLocationType } from "@/lib/onboarding/types";

type FormValues = z.infer<typeof citizenLocationSchema>;

interface CitizenLocationProps {
  data: CitizenLocationType;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
}

export function CitizenLocation({ data, onSubmit, onBack }: CitizenLocationProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(citizenLocationSchema),
    defaultValues: {
      province: data.province,
      city: data.city,
    },
  });

  const selectedProvince = form.watch("province");
  const cities = selectedProvince ? CITIES_BY_PROVINCE[selectedProvince] || [] : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900">
          Where are you located?
        </h2>
        <p className="mt-2 text-gray-500">
          This helps us connect you with local legal resources
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
