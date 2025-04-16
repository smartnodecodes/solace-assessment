"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { Advocate } from "@/types/global";

export default function SearchFilters({
  advocates,
  onFilterChange
}: {
  advocates: Advocate[];
  onFilterChange: (filteredAdvocates: Advocate[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filtered = advocates.filter(advocate => {
      const searchLower = searchTerm.toLowerCase();
      return (
        advocate.firstName.toLowerCase().includes(searchLower) ||
        advocate.lastName.toLowerCase().includes(searchLower) ||
        advocate.city.toLowerCase().includes(searchLower) ||
        advocate.degree.toLowerCase().includes(searchLower) ||
        advocate.specialties.some(specialty =>
          specialty.toLowerCase().includes(searchLower)
        )
      );
    });
    onFilterChange(filtered);
  }, [searchTerm, advocates, onFilterChange]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search advocates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-white text-black/90"
        />
        <Button
          variant="outline"
          onClick={() => setSearchTerm("")}
        >
          Reset
        </Button>
      </div>
      <p className="text-sm text-muted">Search for advocates by name, city, degree, or specialty</p>
    </div>
  );
}