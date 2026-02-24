"use client";

import { SectionBlock } from "@/components/kitchen-sink/SectionBlock";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  FileText,
  Users,
  Clock,
  TrendingUp,
  Check,
} from "lucide-react";

export default function CardsPage() {
  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Components
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Cards
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          Basic cards, branded cards, stat cards, feature cards, dashboard
          widgets, case summary, and pricing cards.
        </p>
      </div>

      {/* 1. Basic Card */}
      <SectionBlock
        title="Basic Card"
        description="Simple Card with header, content, and footer."
        code={`<Card>
  <CardHeader>
    <CardTitle>Case Overview</CardTitle>
    <CardDescription>Summary of the current case status</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-gray-600">
      This is a basic card component used throughout the QanoonAI platform
      for containing related content.
    </p>
  </CardContent>
  <CardFooter>
    <Button variant="outline" size="sm">View Details</Button>
  </CardFooter>
</Card>`}
      >
        <Card>
          <CardHeader>
            <CardTitle>Case Overview</CardTitle>
            <CardDescription>
              Summary of the current case status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              This is a basic card component used throughout the QanoonAI
              platform for containing related content.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </CardFooter>
        </Card>
      </SectionBlock>

      {/* 2. Branded Card */}
      <SectionBlock
        title="Branded Card"
        description="Card with purple accent and branded styling."
        code={`<Card className="border-[#A21CAF]/20 bg-gradient-to-br from-[#A21CAF]/5 to-transparent">
  <CardHeader>
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-lg bg-[#A21CAF] flex items-center justify-center">
        <Scale className="h-4 w-4 text-white" />
      </div>
      <CardTitle>AI Legal Analysis</CardTitle>
    </div>
    <CardDescription>Powered by QanoonAI intelligence engine</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-gray-600">
      Get instant analysis of your legal documents with our AI-powered platform.
    </p>
  </CardContent>
  <CardFooter>
    <Button className="bg-[#A21CAF] hover:bg-[#86198F] text-white">Start Analysis</Button>
  </CardFooter>
</Card>`}
      >
        <Card className="border-[#A21CAF]/20 bg-gradient-to-br from-[#A21CAF]/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#A21CAF] flex items-center justify-center">
                <Scale className="h-4 w-4 text-white" />
              </div>
              <CardTitle>AI Legal Analysis</CardTitle>
            </div>
            <CardDescription>
              Powered by QanoonAI intelligence engine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Get instant analysis of your legal documents with our AI-powered
              platform.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="bg-[#A21CAF] hover:bg-[#86198F] text-white">
              Start Analysis
            </Button>
          </CardFooter>
        </Card>
      </SectionBlock>

      {/* 3. Stat Cards */}
      <SectionBlock
        title="Stat Cards"
        description="Grid of stat cards showing key metrics with trend indicators."
        code={`<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-xl bg-[#A21CAF]/10 flex items-center justify-center">
          <Scale className="h-5 w-5 text-[#A21CAF]" />
        </div>
        <span className="flex items-center text-sm text-emerald-600">
          <ArrowUpRight className="h-4 w-4" />12.5%
        </span>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">2,847</p>
        <p className="text-sm text-gray-500">Total Cases</p>
      </div>
    </CardContent>
  </Card>
  {/* ...more stat cards */}
</div>`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Cases */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-[#A21CAF]/10 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-[#A21CAF]" />
                </div>
                <span className="flex items-center text-sm text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  12.5%
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">2,847</p>
                <p className="text-sm text-gray-500">Total Cases</p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Review */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-amber-500" />
                </div>
                <span className="flex items-center text-sm text-red-600">
                  <ArrowDownRight className="h-4 w-4" />
                  3.2%
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">342</p>
                <p className="text-sm text-gray-500">Pending Review</p>
              </div>
            </CardContent>
          </Card>

          {/* Active Judges */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="flex items-center text-sm text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  8.1%
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-500">Active Judges</p>
              </div>
            </CardContent>
          </Card>

          {/* Avg Resolution */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <span className="flex items-center text-sm text-emerald-600">
                  <ArrowDownRight className="h-4 w-4" />
                  5.4%
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">45 days</p>
                <p className="text-sm text-gray-500">Avg Resolution</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionBlock>

      {/* 4. Feature Cards */}
      <SectionBlock
        title="Feature Cards"
        description="Cards highlighting platform features with icons and descriptions."
        code={`<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <Card className="hover:shadow-md transition-shadow text-center">
    <CardHeader className="items-center">
      <div className="h-12 w-12 rounded-xl bg-[#A21CAF]/10 flex items-center justify-center">
        <Scale className="h-6 w-6 text-[#A21CAF]" />
      </div>
      <CardTitle className="text-base">AI Case Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-500">
        Leverage AI to analyze case precedents and predict outcomes.
      </p>
    </CardContent>
  </Card>
  {/* ...more feature cards */}
</div>`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow text-center">
            <CardHeader className="items-center">
              <div className="h-12 w-12 rounded-xl bg-[#A21CAF]/10 flex items-center justify-center">
                <Scale className="h-6 w-6 text-[#A21CAF]" />
              </div>
              <CardTitle className="text-base">AI Case Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Leverage AI to analyze case precedents, identify relevant
                statutes, and predict outcomes with confidence.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow text-center">
            <CardHeader className="items-center">
              <div className="h-12 w-12 rounded-xl bg-[#A21CAF]/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#A21CAF]" />
              </div>
              <CardTitle className="text-base">Document Drafting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Generate professional legal documents, petitions, and contracts
                with AI-assisted drafting tools.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow text-center">
            <CardHeader className="items-center">
              <div className="h-12 w-12 rounded-xl bg-[#A21CAF]/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#A21CAF]" />
              </div>
              <CardTitle className="text-base">Legal Research</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Search through thousands of case laws, statutes, and legal
                opinions with intelligent research tools.
              </p>
            </CardContent>
          </Card>
        </div>
      </SectionBlock>

      {/* 5. Dashboard Widget Cards */}
      <SectionBlock
        title="Dashboard Widget Cards"
        description="Compact cards with progress indicators for dashboard use."
        code={`<Card>
  <CardHeader className="pb-2">
    <CardDescription>Case Completion Rate</CardDescription>
    <CardTitle className="text-2xl">73%</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div className="h-full rounded-full bg-primary" style={{ width: "73%" }} />
    </div>
    <p className="mt-2 text-xs text-gray-500">+5% from last month</p>
  </CardContent>
</Card>`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Case Completion Rate</CardDescription>
              <CardTitle className="text-2xl">73%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full rounded-full bg-gray-100"><div className="h-full rounded-full bg-primary transition-all" style={{ width: "73%" }} /></div>
              <p className="mt-2 text-xs text-gray-500">
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Client Satisfaction</CardDescription>
              <CardTitle className="text-2xl">92%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full rounded-full bg-gray-100"><div className="h-full rounded-full bg-primary transition-all" style={{ width: "92%" }} /></div>
              <p className="mt-2 text-xs text-gray-500">
                +2% from last month
              </p>
            </CardContent>
          </Card>
        </div>
      </SectionBlock>

      {/* 6. Case Summary Card */}
      <SectionBlock
        title="Case Summary Card"
        description="Detailed card simulating a legal case summary."
        code={`<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
      <span className="text-xs text-gray-400">PLD 2024 SC 112</span>
    </div>
    <CardTitle className="text-lg">Muhammad Ali v. Federation of Pakistan</CardTitle>
    <CardDescription>Constitutional Petition No. 1234/2024</CardDescription>
  </CardHeader>
  <CardContent className="space-y-3">
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">Court</span>
      <span className="font-medium">Supreme Court of Pakistan</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">Filed</span>
      <span className="font-medium">15 Jan 2024</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">Next Hearing</span>
      <span className="font-medium">22 Mar 2024</span>
    </div>
  </CardContent>
  <CardFooter className="flex gap-2">
    <Button variant="outline" size="sm" className="flex-1">View Case</Button>
    <Button size="sm" className="flex-1 bg-[#A21CAF] hover:bg-[#86198F] text-white">AI Analysis</Button>
  </CardFooter>
</Card>`}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Active
              </Badge>
              <span className="text-xs text-gray-400">PLD 2024 SC 112</span>
            </div>
            <CardTitle className="text-lg">
              Muhammad Ali v. Federation of Pakistan
            </CardTitle>
            <CardDescription>
              Constitutional Petition No. 1234/2024
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Court</span>
              <span className="font-medium">Supreme Court of Pakistan</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Filed</span>
              <span className="font-medium">15 Jan 2024</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Next Hearing</span>
              <span className="font-medium">22 Mar 2024</span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Case
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-[#A21CAF] hover:bg-[#86198F] text-white"
            >
              AI Analysis
            </Button>
          </CardFooter>
        </Card>
      </SectionBlock>

      {/* 7. Pricing Cards */}
      <SectionBlock
        title="Pricing Cards"
        description="Side-by-side pricing tiers with feature lists."
        code={`<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Basic Plan */}
  <Card>
    <CardHeader>
      <CardTitle>Basic</CardTitle>
      <CardDescription>For individual practitioners</CardDescription>
      <p className="text-3xl font-bold text-gray-900">PKR 5,000<span className="text-sm font-normal text-gray-500">/mo</span></p>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        <li className="flex items-center gap-2 text-sm">
          <Check className="h-4 w-4 text-emerald-500" />Up to 50 cases
        </li>
        ...
      </ul>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">Get Started</Button>
    </CardFooter>
  </Card>

  {/* Professional Plan */}
  <Card className="border-[#A21CAF]/30 bg-gradient-to-br from-[#A21CAF]/5 to-transparent relative">
    <Badge className="absolute top-4 right-4 bg-[#A21CAF] text-white hover:bg-[#A21CAF]">Popular</Badge>
    ...
  </Card>
</div>`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Basic Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <CardDescription>For individual practitioners</CardDescription>
              <p className="text-3xl font-bold text-gray-900">
                PKR 5,000
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Up to 50 cases
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Basic AI analysis
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Document templates
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Email support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </CardFooter>
          </Card>

          {/* Professional Plan */}
          <Card className="border-[#A21CAF]/30 bg-gradient-to-br from-[#A21CAF]/5 to-transparent relative">
            <Badge className="absolute top-4 right-4 bg-[#A21CAF] text-white hover:bg-[#A21CAF]">
              Popular
            </Badge>
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <CardDescription>For law firms and teams</CardDescription>
              <p className="text-3xl font-bold text-gray-900">
                PKR 15,000
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Unlimited cases
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Advanced AI analysis
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Custom document drafting
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Priority support
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Team collaboration
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  API access
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#A21CAF] hover:bg-[#86198F] text-white">
                Get Started
              </Button>
            </CardFooter>
          </Card>
        </div>
      </SectionBlock>
    </div>
  );
}
