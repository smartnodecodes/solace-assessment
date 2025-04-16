"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import type { Advocate } from "@/types/global";
import { ALL_SPECIALTIES, getSpecialtyInfo } from "@/lib/format";

export default function SpecialitiesFilter({
  advocates,
  onFilterChange
}: {
  advocates: Advocate[];
  onFilterChange: (filteredAdvocates: Advocate[]) => void;
}) {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  useEffect(() => {
    if (selectedSpecialties.length === 0) {
      onFilterChange(advocates);
      return;
    }

    const filtered = advocates.filter(advocate =>
      selectedSpecialties.every(specialty =>
        advocate.specialties?.includes(specialty)
      )
    );
    onFilterChange(filtered);
  }, [selectedSpecialties, advocates, onFilterChange]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Filter by Specialties</h3>
          <p className="text-sm text-gray-500">Filter advocates by their specialties ({selectedSpecialties.length} selected)</p>
        </div>
        <Button variant="outline" onClick={() => setSelectedSpecialties([])}>Clear</Button>
      </div>

      <ToggleGroup
        type="multiple"
        value={selectedSpecialties}
        onValueChange={setSelectedSpecialties}
        className="flex flex-wrap gap-2"
      >
        {ALL_SPECIALTIES.sort((a: string, b: string) => a.localeCompare(b)).map((specialty: string) => {
          const { color, title, description } = getSpecialtyInfo(specialty);
          return (
            <ToggleGroupItem
              key={specialty}
              value={specialty}
              size="sm"
              variant="outline"
              className={`${color} text-white data-[state=on]:opacity-100 data-[state=off]:opacity-50 hover:text-white transition-opacity`}
            >
              {title}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}