"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { judgeLocationSchema } from "@/lib/onboarding/schemas";
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
import { ArrowLeft, Check } from "lucide-react";
import { PROVINCES, CITIES_BY_PROVINCE } from "@/lib/onboarding/constants";
import type { JudgeLocation as JudgeLocationType } from "@/lib/onboarding/types";

type FormValues = z.infer<typeof judgeLocationSchema>;

interface JudgeLocationProps {
  data: JudgeLocationType;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
}

export function JudgeLocation({ data, onSubmit, onBack }: JudgeLocationProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(judgeLocationSchema),
    defaultValues: {
      province: data.province,
      city: data.city,
      courtName: data.courtName,
    },
  });

  const selectedProvince = form.watch("province");
  const cities = selectedProvince ? CITIES_BY_PROVINCE[selectedProvince] || [] : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900">
          Where is your court located?
        </h2>
        <p className="mt-2 text-gray-500">
          Help us provide location-relevant resources
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

          <FormField
            control={form.control}
            name="courtName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Court Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. District Court Lahore" {...field} />
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
              Complete
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
