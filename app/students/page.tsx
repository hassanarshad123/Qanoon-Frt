"use client";

import { useSession } from "next-auth/react";
import { BookOpen, FileText, HelpCircle, BookMarked } from "lucide-react";

const features = [
  {
    title: "Case Summaries",
    description: "AI-powered summaries of landmark Pakistani cases",
    icon: FileText,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Study Resources",
    description: "Curated legal study materials and references",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Practice Questions",
    description: "AI-generated exam prep questions with model answers",
    icon: HelpCircle,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Legal Dictionary",
    description: "Comprehensive legal terminology in Urdu & English",
    icon: BookMarked,
    color: "bg-amber-100 text-amber-600",
  },
];

export default function StudentsPage() {
  const { data: session } = useSession();
  const name = session?.user?.name?.split(" ")[0] || "Student";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">
          Welcome, {name}!
        </h1>
        <p className="mt-2 text-gray-500">
          Your legal study companion is ready. Explore the tools below.
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

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <p className="text-emerald-700 font-medium">
          More features coming soon! We&apos;re building powerful study tools just for law students.
        </p>
      </div>
    </div>
  );
}
