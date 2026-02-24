"use client";

import { Scale, Gavel, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROLE_COLORS } from "@/lib/onboarding/constants";
import type { UserRole } from "@/lib/onboarding/types";

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void;
  userName?: string;
}

const roles = [
  {
    id: "lawyer" as UserRole,
    label: "Lawyer",
    description: "Case management, legal research, and practice tools",
    icon: Scale,
  },
  {
    id: "judge" as UserRole,
    label: "Judge",
    description: "Judicial tools, case analysis, and bench resources",
    icon: Gavel,
  },
  {
    id: "law_student" as UserRole,
    label: "Law Student",
    description: "Study aids, case summaries, and exam preparation",
    icon: GraduationCap,
  },
  {
    id: "common_person" as UserRole,
    label: "Common Citizen",
    description: "Know your rights and find legal assistance",
    icon: Users,
  },
];

export function RoleSelection({ onSelect, userName }: RoleSelectionProps) {
  const greeting = userName ? `Hi ${userName.split(" ")[0]}!` : "Welcome!";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900">
          {greeting} Tell us who you are
        </h2>
        <p className="mt-2 text-gray-500">
          We&apos;ll personalize QanoonAI just for you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const colors = ROLE_COLORS[role.id];
          return (
            <button
              key={role.id}
              onClick={() => onSelect(role.id)}
              className={cn(
                "group relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200",
                "transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer",
                "hover:border-accent-dynamic hover:bg-accent-light"
              )}
              style={{
                ["--accent" as string]: colors.primary,
                ["--accent-light" as string]: colors.light,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors bg-accent-light text-accent-dynamic"
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-gray-900">
                  {role.label}
                </h3>
                <p className="text-sm mt-1 text-gray-500">
                  {role.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
