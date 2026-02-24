"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";

import { SectionBlock } from "@/components/kitchen-sink/SectionBlock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils/cn";

const caseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  court: z.string().min(1, "Please select a court"),
  caseType: z.string().min(1, "Please select a case type"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  urgent: z.boolean().default(false),
});

type CaseFormValues = z.infer<typeof caseSchema>;

export default function FormsPage() {
  const [date, setDate] = useState<Date>();

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: "",
      court: "",
      caseType: "",
      description: "",
      urgent: false,
    },
  });

  function onSubmit(data: CaseFormValues) {
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Components
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Forms
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          Inputs, textareas, selects, checkboxes, radios, switches, date
          pickers, OTP, and a complete validated form.
        </p>
      </div>

      {/* 1. Text Input */}
      <SectionBlock
        title="Text Input"
        description="Basic text input fields with labels, placeholders, disabled state, and helper text."
        code={`<div className="space-y-2">
  <Label>Case Title</Label>
  <Input placeholder="Enter case title..." />
  <p className="text-sm text-gray-500">Provide the official title of the case.</p>
</div>

<div className="space-y-2">
  <Label>Disabled Input</Label>
  <Input disabled placeholder="Disabled input" />
</div>`}
      >
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <Label>Case Title</Label>
            <Input placeholder="Enter case title..." />
            <p className="text-sm text-gray-500">
              Provide the official title of the case.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Disabled Input</Label>
            <Input disabled placeholder="Disabled input" />
          </div>
        </div>
      </SectionBlock>

      {/* 2. Textarea */}
      <SectionBlock
        title="Textarea"
        description="Multi-line text input for longer content such as case descriptions."
        code={`<div className="space-y-2">
  <Label>Case Description</Label>
  <Textarea placeholder="Describe the case details..." />
</div>`}
      >
        <div className="space-y-2">
          <Label>Case Description</Label>
          <Textarea placeholder="Describe the case details..." />
        </div>
      </SectionBlock>

      {/* 3. Select */}
      <SectionBlock
        title="Select"
        description="Dropdown select for choosing from a predefined list of options."
        code={`<Select>
  <SelectTrigger className="w-[280px]">
    <SelectValue placeholder="Select court" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="supreme">Supreme Court of Pakistan</SelectItem>
    <SelectItem value="lahore-hc">Lahore High Court</SelectItem>
    <SelectItem value="sindh-hc">Sindh High Court</SelectItem>
    <SelectItem value="islamabad-hc">Islamabad High Court</SelectItem>
    <SelectItem value="peshawar-hc">Peshawar High Court</SelectItem>
    <SelectItem value="balochistan-hc">Balochistan High Court</SelectItem>
  </SelectContent>
</Select>`}
      >
        <Select>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select court" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supreme">Supreme Court of Pakistan</SelectItem>
            <SelectItem value="lahore-hc">Lahore High Court</SelectItem>
            <SelectItem value="sindh-hc">Sindh High Court</SelectItem>
            <SelectItem value="islamabad-hc">Islamabad High Court</SelectItem>
            <SelectItem value="peshawar-hc">Peshawar High Court</SelectItem>
            <SelectItem value="balochistan-hc">
              Balochistan High Court
            </SelectItem>
          </SelectContent>
        </Select>
      </SectionBlock>

      {/* 4. Checkbox */}
      <SectionBlock
        title="Checkbox"
        description="Checkboxes for toggling boolean options."
        code={`<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>

<div className="flex items-center space-x-2">
  <Checkbox id="notify" defaultChecked />
  <Label htmlFor="notify">Email notifications</Label>
</div>`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="notify" defaultChecked />
            <Label htmlFor="notify">Email notifications</Label>
          </div>
        </div>
      </SectionBlock>

      {/* 5. Radio Group */}
      <SectionBlock
        title="Radio Group"
        description="Radio buttons for selecting a single option from a group."
        code={`<RadioGroup defaultValue="civil">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="civil" id="civil" />
    <Label htmlFor="civil">Civil</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="criminal" id="criminal" />
    <Label htmlFor="criminal">Criminal</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="constitutional" id="constitutional" />
    <Label htmlFor="constitutional">Constitutional</Label>
  </div>
</RadioGroup>`}
      >
        <RadioGroup defaultValue="civil">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="civil" id="civil" />
            <Label htmlFor="civil">Civil</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="criminal" id="criminal" />
            <Label htmlFor="criminal">Criminal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="constitutional" id="constitutional" />
            <Label htmlFor="constitutional">Constitutional</Label>
          </div>
        </RadioGroup>
      </SectionBlock>

      {/* 6. Switch */}
      <SectionBlock
        title="Switch"
        description="Toggle switch for binary on/off settings."
        code={`<div className="flex items-center space-x-2">
  <Switch id="urgent" />
  <Label htmlFor="urgent">Mark as Urgent</Label>
</div>`}
      >
        <div className="flex items-center space-x-2">
          <Switch id="urgent" />
          <Label htmlFor="urgent">Mark as Urgent</Label>
        </div>
      </SectionBlock>

      {/* 7. OTP Input */}
      <SectionBlock
        title="OTP Input"
        description="One-time password input with individual character slots."
        code={`<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`}
      >
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </SectionBlock>

      {/* 8. Date Picker */}
      <SectionBlock
        title="Date Picker"
        description="Calendar-based date picker inside a popover, useful for selecting hearing dates."
        code={`const [date, setDate] = useState<Date>();

<Popover>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      className={cn(
        "w-[280px] justify-start text-left font-normal",
        !date && "text-muted-foreground"
      )}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, "PPP") : "Pick a hearing date"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      initialFocus
    />
  </PopoverContent>
</Popover>`}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a hearing date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </SectionBlock>

      {/* 9. File Upload Area */}
      <SectionBlock
        title="File Upload Area"
        description="Drag and drop styled upload area for documents."
        code={`<div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#A21CAF]/50 transition-colors">
  <Upload className="mx-auto h-10 w-10 text-gray-400" />
  <p className="mt-2 text-sm text-gray-600">
    Drag & drop files here, or <span className="text-[#A21CAF] font-medium cursor-pointer">browse</span>
  </p>
  <p className="mt-1 text-xs text-gray-400">PDF, DOCX up to 10MB</p>
</div>`}
      >
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#A21CAF]/50 transition-colors">
          <Upload className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag & drop files here, or{" "}
            <span className="text-[#A21CAF] font-medium cursor-pointer">
              browse
            </span>
          </p>
          <p className="mt-1 text-xs text-gray-400">PDF, DOCX up to 10MB</p>
        </div>
      </SectionBlock>

      {/* 10. Complete Form — New Case Filing */}
      <SectionBlock
        title='Complete Form — "New Case Filing"'
        description="A fully validated form using react-hook-form and zod schema validation."
        code={`const caseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  court: z.string().min(1, "Please select a court"),
  caseType: z.string().min(1, "Please select a case type"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  urgent: z.boolean().default(false),
});

const form = useForm<CaseFormValues>({
  resolver: zodResolver(caseSchema),
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField control={form.control} name="title" render={({ field }) => (
      <FormItem>
        <FormLabel>Case Title</FormLabel>
        <FormControl><Input placeholder="Enter case title..." {...field} /></FormControl>
        <FormDescription>The official title for the case filing.</FormDescription>
        <FormMessage />
      </FormItem>
    )} />
    {/* ...court, caseType, description, urgent fields... */}
    <Button type="submit" className="bg-[#A21CAF] hover:bg-[#86198F] text-white">
      Submit Case Filing
    </Button>
  </form>
</Form>`}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-lg"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter case title..." {...field} />
                  </FormControl>
                  <FormDescription>
                    The official title for the case filing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Court */}
            <FormField
              control={form.control}
              name="court"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Court</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select court" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="supreme">
                        Supreme Court of Pakistan
                      </SelectItem>
                      <SelectItem value="lahore-hc">
                        Lahore High Court
                      </SelectItem>
                      <SelectItem value="sindh-hc">
                        Sindh High Court
                      </SelectItem>
                      <SelectItem value="islamabad-hc">
                        Islamabad High Court
                      </SelectItem>
                      <SelectItem value="peshawar-hc">
                        Peshawar High Court
                      </SelectItem>
                      <SelectItem value="balochistan-hc">
                        Balochistan High Court
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the court where the case will be filed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Case Type */}
            <FormField
              control={form.control}
              name="caseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select case type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="civil">Civil</SelectItem>
                      <SelectItem value="criminal">Criminal</SelectItem>
                      <SelectItem value="constitutional">
                        Constitutional
                      </SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category of the case.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the case details..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the case.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Urgent */}
            <FormField
              control={form.control}
              name="urgent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Urgent</FormLabel>
                    <FormDescription>
                      Mark this case as urgent for priority handling.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-[#A21CAF] hover:bg-[#86198F] text-white"
            >
              Submit Case Filing
            </Button>
          </form>
        </Form>
      </SectionBlock>
    </div>
  );
}
