"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ALL_SPECIALTIES, Specialty } from "@/lib/format";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getSpecialtyInfo } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAdvocates from "@/hooks/useAdvocates";

const DEGREE_TYPES = [
  "MD",
  "DO",
  "NP",
  "PA",
  "RN",
  "PhD",
  "MSN",
  "MPH",
] as const;

export default function AddAdvocateForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { createAdvocate } = useAdvocates();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    degree: "",
    specialties: [] as Specialty[],
    yearsOfExperience: "",
    phoneNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createAdvocate({
        ...formData,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
      });
      onClose();
    } catch (error) {
      console.error("Error creating advocate:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="degree">Degree</Label>
          <Select
            value={formData.degree}
            onValueChange={(value) => setFormData({ ...formData, degree: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a degree" />
            </SelectTrigger>
            <SelectContent>
              {DEGREE_TYPES.map((degree) => (
                <SelectItem key={degree} value={degree}>
                  {degree}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input
            id="yearsOfExperience"
            type="number"
            min="0"
            value={formData.yearsOfExperience}
            onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number (optional)</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Specialties</Label>
        <ToggleGroup
          type="multiple"
          value={formData.specialties}
          onValueChange={(value) => setFormData({ ...formData, specialties: value as Specialty[] })}
          className="flex flex-wrap gap-2"
        >
          {[...ALL_SPECIALTIES].sort((a: Specialty, b: Specialty) => a.localeCompare(b)).map((specialty) => {
            const { color, title } = getSpecialtyInfo(specialty);
            return (
              <ToggleGroupItem
                key={specialty}
                value={specialty}
                size="sm"
                variant="outline"
                className={`${color} text-white data-[state=on]:opacity-100 data-[state=off]:opacity-50 hover:text-white hover:bg-primary transition-opacity`}
              >
                {title}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Advocate"}
        </Button>
      </div>
    </form>
  );
} 