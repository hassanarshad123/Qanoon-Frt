"use client";

import { useEffect, useState } from "react";
import { User, Building2, MapPin, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/judges/shared/page-header";
import { profilesApi } from "@/lib/api/profiles";
import type { JudgeProfile } from "@/lib/types/shared";
import { toast } from "sonner";

const courtLevels = [
  "Supreme Court",
  "Federal Shariat Court",
  "High Court",
  "District & Sessions Court",
  "Civil Court",
  "Family Court",
  "Anti-Terrorism Court",
  "Banking Court",
  "Labour Court",
  "Consumer Court",
  "Tribunal",
  "Other",
];

const designations = [
  "Chief Justice",
  "Justice",
  "Senior Puisne Judge",
  "District & Sessions Judge",
  "Additional District & Sessions Judge",
  "Senior Civil Judge",
  "Civil Judge",
  "Family Court Judge",
  "Magistrate",
  "Other",
];

const provinces = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<JudgeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [courtLevel, setCourtLevel] = useState("");
  const [designation, setDesignation] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [courtName, setCourtName] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const p = await profilesApi.getJudgeProfile();
        setProfile(p);
        setFullName(p.fullName || "");
        setEmail(p.email || "");
        setPhone(p.phone || "");
        setCourtLevel(p.courtLevel || "");
        setDesignation(p.designation || "");
        setProvince(p.province || "");
        setCity(p.city || "");
        setCourtName(p.courtName || "");
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const updated = await profilesApi.updateJudgeProfile({
        fullName: fullName || null,
        email: email || null,
        phone: phone || null,
        courtLevel: courtLevel || null,
        designation: designation || null,
        province: province || null,
        city: city || null,
        courtName: courtName || null,
      });
      setProfile(updated);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 text-[#A21CAF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        label="Profile"
        title="Judge Profile"
        description="Manage your personal and court information"
      />

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#A21CAF]/10 flex items-center justify-center">
              <User className="h-4 w-4 text-[#A21CAF]" />
            </div>
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName" className="text-sm">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Justice Ahmad Khan"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="designation" className="text-sm">
                Designation
              </Label>
              <Select value={designation} onValueChange={setDesignation}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select designation..." />
                </SelectTrigger>
                <SelectContent>
                  {designations.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="judge@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm">
                Phone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Court Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-amber-600" />
            </div>
            Court Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courtLevel" className="text-sm">
                Court Level
              </Label>
              <Select value={courtLevel} onValueChange={setCourtLevel}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select court level..." />
                </SelectTrigger>
                <SelectContent>
                  {courtLevels.map((cl) => (
                    <SelectItem key={cl} value={cl}>
                      {cl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="courtName" className="text-sm">
                Court Name
              </Label>
              <Input
                id="courtName"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                placeholder="e.g., Lahore High Court"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="province" className="text-sm">
                Province / Territory
              </Label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select province..." />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="city" className="text-sm">
                City
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Lahore"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#A21CAF] hover:bg-[#86198F] text-white"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
