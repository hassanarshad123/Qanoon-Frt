"use client";

import { useSession } from "next-auth/react";
import { Shield, Search, HelpCircle, FileSearch } from "lucide-react";

const features = [
  {
    title: "Know Your Rights",
    description: "Understand your legal rights in plain Urdu & English",
    icon: Shield,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Find a Lawyer",
    description: "Connect with verified lawyers for your specific issue",
    icon: Search,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Legal FAQs",
    description: "Answers to common legal questions in simple language",
    icon: HelpCircle,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Track My Case",
    description: "Stay informed about your legal proceedings",
    icon: FileSearch,
    color: "bg-emerald-100 text-emerald-600",
  },
];

export default function CitizensPage() {
  const { data: session } = useSession();
  const name = session?.user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">
          Welcome, {name}!
        </h1>
        <p className="mt-2 text-gray-500">
          Your legal guide is here to help. Explore the resources below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
        <p className="text-amber-700 font-medium">
          More features coming soon! We&apos;re building tools to make legal help accessible for everyone.
        </p>
      </div>
    </div>
  );
}
