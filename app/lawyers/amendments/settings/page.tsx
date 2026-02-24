"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/judges/shared/page-header";
import { useToast } from "@/hooks/use-toast";

const trackedStatutes = [
  { id: "ppc", label: "Pakistan Penal Code (PPC)" },
  { id: "crpc", label: "Code of Criminal Procedure (CrPC)" },
  { id: "cpc", label: "Code of Civil Procedure (CPC)" },
  { id: "constitution", label: "Constitution of Pakistan" },
  { id: "qso", label: "Qanun-e-Shahadat Order (QSO)" },
];

const impactLevels = [
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
];

export default function AmendmentSettingsPage() {
  const { toast } = useToast();

  const [statuteToggles, setStatuteToggles] = useState<Record<string, boolean>>(
    {
      ppc: true,
      crpc: true,
      cpc: true,
      constitution: false,
      qso: false,
    }
  );

  const [emailNotifications, setEmailNotifications] = useState(true);

  const [impactChecks, setImpactChecks] = useState<Record<string, boolean>>({
    high: true,
    medium: true,
    low: false,
  });

  function handleStatuteToggle(id: string) {
    setStatuteToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleImpactToggle(id: string) {
    setImpactChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSave() {
    toast({
      title: "Preferences saved",
      description: "Your amendment alert preferences have been updated.",
    });
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/lawyers/amendments">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Amendment Alerts
        </Link>
      </Button>

      <PageHeader
        label="Settings"
        title="Amendment Alert Preferences"
        description="Configure which statutes and notification types you want to track"
      />

      {/* Tracked Statutes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tracked Statutes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trackedStatutes.map((statute) => (
            <div
              key={statute.id}
              className="flex items-center justify-between py-2"
            >
              <label
                htmlFor={`statute-${statute.id}`}
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                {statute.label}
              </label>
              <Switch
                id={`statute-${statute.id}`}
                checked={statuteToggles[statute.id]}
                onCheckedChange={() => handleStatuteToggle(statute.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Email Notifications
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Receive amendment alerts via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          {/* Impact Level Checkboxes */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Impact Levels
            </p>
            <div className="space-y-3">
              {impactLevels.map((level) => (
                <div key={level.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`impact-${level.id}`}
                    checked={impactChecks[level.id]}
                    onCheckedChange={() => handleImpactToggle(level.id)}
                  />
                  <label
                    htmlFor={`impact-${level.id}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {level.label} Impact
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          className="bg-[#2563EB] hover:bg-[#1D4ED8]"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
