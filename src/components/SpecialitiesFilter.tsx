"use client";

import { useState, useEffect } from "react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import type { Advocate } from "@/types/global";
import { ALL_SPECIALTIES, getSpecialtyColor } from "@/lib/format";

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
                advocate.specialties.includes(specialty)
            )
        );
        onFilterChange(filtered);
    }, [selectedSpecialties, advocates, onFilterChange]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Filter by Specialties</CardTitle>
                <CardDescription>Filter advocates by their specialties ({selectedSpecialties.length} selected)</CardDescription>
            </CardHeader>
            <CardContent>
                <ToggleGroup
                    type="multiple"
                    value={selectedSpecialties}
                    onValueChange={setSelectedSpecialties}
                    className="flex flex-wrap gap-2"
                >
                    {ALL_SPECIALTIES.sort((a, b) => a.localeCompare(b)).map((specialty) => (
                        <ToggleGroupItem
                            key={specialty}
                            value={specialty}
                            className={`${getSpecialtyColor(specialty)} text-white data-[state=on]:opacity-100 data-[state=off]:opacity-50 transition-opacity`}
                        >
                            {specialty}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </CardContent>
        </Card>
    );
}