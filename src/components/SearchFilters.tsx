"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { Advocate } from "@/types/global";

export default function SearchFilters({
  searchTerm,
  onSearchChange
}: {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search advocates..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm bg-white text-black/90"
        />
        <Button
          variant="outline"
          onClick={() => onSearchChange("")}
        >
          Reset
        </Button>
      </div>
      <p className="text-sm text-muted">Search for advocates by name, city, degree, or specialty</p>
    </div>
  );
}