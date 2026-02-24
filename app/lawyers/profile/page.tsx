"use client";

import { useEffect, useState } from "react";
import { User, Briefcase, Building2, MapPin, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/judges/shared/page-header";
import { profilesApi } from "@/lib/api/profiles";
import type { LawyerProfile } from "@/lib/types/shared";
import { toast } from "sonner";
import {
  EXPERIENCE_RANGES,
  PRACTICE_AREAS,
  FIRM_TYPES,
  PROVINCES,
} from "@/lib/onboarding/constants";

export default function LawyerProfilePage() {
  const [profile, setProfile] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [barCouncilNumber, setBarCouncilNumber] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  const [primaryCourt, setPrimaryCourt] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [firmType, setFirmType] = useState("");
  const [firmName, setFirmName] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const p = await profilesApi.getLawyerProfile();
        setProfile(p);
        setFullName(p.fullName || "");
        setEmail(p.email || "");
        setPhone(p.phone || "");
        setBarCouncilNumber(p.barCouncilNumber || "");
        setYearsOfExperience(p.yearsOfExperience || "");
        setPracticeAreas(p.practiceAreas || []);
        setPrimaryCourt(p.primaryCourt || "");
        setProvince(p.province || "");
        setCity(p.city || "");
        setFirmType(p.firmType || "");
        setFirmName(p.firmName || "");
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handlePracticeAreaToggle = (area: string) => {
    setPracticeAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const updated = await profilesApi.updateLawyerProfile({
        fullName: fullName || null,
        email: email || null,
        phone: phone || null,
        barCouncilNumber: barCouncilNumber || null,
        yearsOfExperience: yearsOfExperience || null,
        practiceAreas,
        primaryCourt: primaryCourt || null,
        province: province || null,
        city: city || null,
        firmType: firmType || null,
        firmName: firmName || null,
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
        <Loader2 className="h-8 w-8 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        label="Profile"
        title="Lawyer Profile"
        description="Manage your personal, practice, and firm information"
      />

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
              <User className="h-4 w-4 text-[#2563EB]" />
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
                placeholder="e.g., Advocate Fatima Khan"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advocate@example.com"
                className="mt-1"
              />
            </div>
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
              className="mt-1 max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Practice Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-amber-600" />
            </div>
            Practice Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="barCouncilNumber" className="text-sm">
                Bar Council Number
              </Label>
              <Input
                id="barCouncilNumber"
                value={barCouncilNumber}
                onChange={(e) => setBarCouncilNumber(e.target.value)}
                placeholder="e.g., PBC-12345"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="yearsOfExperience" className="text-sm">
                Years of Experience
              </Label>
              <Select value={yearsOfExperience} onValueChange={setYearsOfExperience}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select experience..." />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm">Practice Areas</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {PRACTICE_AREAS.map((area) => (
                <label
                  key={area}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={practiceAreas.includes(area)}
                    onCheckedChange={() => handlePracticeAreaToggle(area)}
                  />
                  {area}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="primaryCourt" className="text-sm">
              Primary Court
            </Label>
            <Input
              id="primaryCourt"
              value={primaryCourt}
              onChange={(e) => setPrimaryCourt(e.target.value)}
              placeholder="e.g., Lahore High Court"
              className="mt-1 max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Location & Firm */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-emerald-600" />
            </div>
            Location & Firm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  {PROVINCES.map((p) => (
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firmType" className="text-sm">
                Firm Type
              </Label>
              <Select value={firmType} onValueChange={setFirmType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select firm type..." />
                </SelectTrigger>
                <SelectContent>
                  {FIRM_TYPES.map((ft) => (
                    <SelectItem key={ft.value} value={ft.value}>
                      {ft.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {firmType && firmType !== "solo" && (
              <div>
                <Label htmlFor="firmName" className="text-sm">
                  Firm Name
                </Label>
                <Input
                  id="firmName"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder="e.g., Khan & Associates"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
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
