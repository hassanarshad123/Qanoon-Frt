"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionBlock } from "@/components/kitchen-sink/SectionBlock";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Scale,
  Menu,
  Home,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";

export default function NavigationPage() {
  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Components
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Navigation
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          Header, sidebar, breadcrumbs, tabs, pagination, sheets, and drawers.
        </p>
      </div>

      {/* 1. Mini Header */}
      <SectionBlock
        title="Mini Header"
        description="A compact recreation of the QanoonAI header with logo, nav links, and action buttons."
        code={`<div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-3">
  <div className="flex items-center gap-2">
    <Scale className="h-5 w-5 text-[#A21CAF]" />
    <span className="font-serif font-bold text-lg">QanoonAI</span>
  </div>
  <nav className="hidden md:flex items-center gap-6">
    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Products</a>
    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">About</a>
  </nav>
  <div className="flex items-center gap-3">
    <Button variant="ghost" size="sm">Sign In</Button>
    <Button size="sm" className="bg-[#A21CAF] hover:bg-[#86198F] text-white">Get Started</Button>
  </div>
</div>`}
      >
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-[#A21CAF]" />
            <span className="font-serif font-bold text-lg">QanoonAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Products
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              About
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-[#A21CAF] hover:bg-[#86198F] text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </SectionBlock>

      {/* 2. Sidebar Pattern */}
      <SectionBlock
        title="Sidebar Pattern"
        description="A mini sidebar navigation showing active and inactive states with icons."
        code={`<div className="w-56 rounded-xl border border-gray-200 bg-white p-2">
  <nav className="space-y-1">
    <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
      <Home className="h-4 w-4" /> Home
    </a>
    <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm bg-[#A21CAF]/10 text-[#A21CAF] font-medium">
      <FileText className="h-4 w-4" /> Cases
    </a>
    <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
      <FileText className="h-4 w-4" /> Documents
    </a>
    <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
      <Users className="h-4 w-4" /> Users
    </a>
    <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
      <Settings className="h-4 w-4" /> Settings
    </a>
  </nav>
</div>`}
      >
        <div className="w-56 rounded-xl border border-gray-200 bg-white p-2">
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              <Home className="h-4 w-4" /> Home
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm bg-[#A21CAF]/10 text-[#A21CAF] font-medium"
            >
              <FileText className="h-4 w-4" /> Cases
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              <FileText className="h-4 w-4" /> Documents
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              <Users className="h-4 w-4" /> Users
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              <Settings className="h-4 w-4" /> Settings
            </a>
          </nav>
        </div>
      </SectionBlock>

      {/* 3. Breadcrumbs */}
      <SectionBlock
        title="Breadcrumbs"
        description="Two-level and three-level breadcrumb navigation patterns."
        code={`{/* 2-level */}
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/kitchen-sink">Kitchen Sink</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Colors</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

{/* 3-level */}
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/kitchen-sink">Kitchen Sink</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Judges Portal</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Case Management</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
      >
        <div className="space-y-4">
          {/* 2-level */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/kitchen-sink">
                  Kitchen Sink
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Colors</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* 3-level */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/kitchen-sink">
                  Kitchen Sink
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Judges Portal</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Case Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </SectionBlock>

      {/* 4. Tabs */}
      <SectionBlock
        title="Tabs"
        description="Tabbed navigation for switching between content panels."
        code={`<Tabs defaultValue="overview" className="w-full">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="documents">Documents</TabsTrigger>
    <TabsTrigger value="timeline">Timeline</TabsTrigger>
    <TabsTrigger value="notes">Notes</TabsTrigger>
  </TabsList>
  <TabsContent value="overview" className="mt-4">
    <p className="text-sm text-gray-600">Case overview content goes here...</p>
  </TabsContent>
  <TabsContent value="documents" className="mt-4">
    <p className="text-sm text-gray-600">Document list and management interface.</p>
  </TabsContent>
  <TabsContent value="timeline" className="mt-4">
    <p className="text-sm text-gray-600">Case timeline with key dates and events.</p>
  </TabsContent>
  <TabsContent value="notes" className="mt-4">
    <p className="text-sm text-gray-600">Judge's notes and observations.</p>
  </TabsContent>
</Tabs>`}
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <p className="text-sm text-gray-600">
              Case overview content goes here with all relevant details about
              the case.
            </p>
          </TabsContent>
          <TabsContent value="documents" className="mt-4">
            <p className="text-sm text-gray-600">
              Document list and management interface.
            </p>
          </TabsContent>
          <TabsContent value="timeline" className="mt-4">
            <p className="text-sm text-gray-600">
              Case timeline with key dates and events.
            </p>
          </TabsContent>
          <TabsContent value="notes" className="mt-4">
            <p className="text-sm text-gray-600">
              Judge&apos;s notes and observations.
            </p>
          </TabsContent>
        </Tabs>
      </SectionBlock>

      {/* 5. Pagination */}
      <SectionBlock
        title="Pagination"
        description="Page navigation controls with active state and disabled first/last buttons."
        code={`<div className="flex items-center gap-2">
  <Button variant="outline" size="sm" disabled>
    <ChevronLeft className="h-4 w-4" />
  </Button>
  <Button variant="outline" size="sm" className="bg-[#A21CAF] text-white hover:bg-[#86198F]">1</Button>
  <Button variant="outline" size="sm">2</Button>
  <Button variant="outline" size="sm">3</Button>
  <Button variant="outline" size="sm">...</Button>
  <Button variant="outline" size="sm">12</Button>
  <Button variant="outline" size="sm">
    <ChevronRight className="h-4 w-4" />
  </Button>
</div>`}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#A21CAF] text-white hover:bg-[#86198F]"
          >
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            ...
          </Button>
          <Button variant="outline" size="sm">
            12
          </Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </SectionBlock>

      {/* 6. Sheet (Mobile Drawer) */}
      <SectionBlock
        title="Sheet (Side Panel)"
        description="A slide-out panel from the edge of the screen, ideal for detail views on mobile."
        code={`<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">
      <Menu className="mr-2 h-4 w-4" /> Open Side Panel
    </Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Case Details</SheetTitle>
      <SheetDescription>View and manage case information</SheetDescription>
    </SheetHeader>
    <div className="mt-6 space-y-4">
      <div>
        <p className="text-sm text-gray-500">Case Number</p>
        <p className="font-medium">CP-1234/2024</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Court</p>
        <p className="font-medium">Supreme Court of Pakistan</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Status</p>
        <p className="font-medium text-emerald-600">Active</p>
      </div>
    </div>
  </SheetContent>
</Sheet>`}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Menu className="mr-2 h-4 w-4" /> Open Side Panel
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Case Details</SheetTitle>
              <SheetDescription>
                View and manage case information
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Case Number</p>
                <p className="font-medium">CP-1234/2024</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Court</p>
                <p className="font-medium">Supreme Court of Pakistan</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-emerald-600">Active</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </SectionBlock>

      {/* 7. Drawer (Bottom Sheet) */}
      <SectionBlock
        title="Drawer (Bottom Sheet)"
        description="A bottom-up drawer for quick actions, commonly used on mobile devices."
        code={`<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open Bottom Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Quick Actions</DrawerTitle>
      <DrawerDescription>Choose an action for this case</DrawerDescription>
    </DrawerHeader>
    <div className="p-4 space-y-2">
      <Button variant="outline" className="w-full justify-start">View Case Details</Button>
      <Button variant="outline" className="w-full justify-start">Download Documents</Button>
      <Button variant="outline" className="w-full justify-start">Schedule Hearing</Button>
      <Button variant="outline" className="w-full justify-start text-red-600">Close Case</Button>
    </div>
  </DrawerContent>
</Drawer>`}
      >
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open Bottom Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Quick Actions</DrawerTitle>
              <DrawerDescription>
                Choose an action for this case
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-start">
                View Case Details
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Documents
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Schedule Hearing
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600"
              >
                Close Case
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </SectionBlock>
    </div>
  );
}
