"use client";

import { useEffect, useState, useMemo } from "react";

import { Loader2 } from "lucide-react";

import useAdvocates from "@/hooks/useAdvocates";

import SearchFilters from "@/components/SearchFilters";
import SpecialitiesFilter from "@/components/SpecialitiesFilter";
import AdvocatesTable from "@/components/AdvocatesTable";

import type { Advocate } from "@/types/global";

export default function Home() {
  const [searchFilteredAdvocates, setSearchFilteredAdvocates] = useState<Advocate[]>([]);
  const [specialtyFilteredAdvocates, setSpecialtyFilteredAdvocates] = useState<Advocate[]>([]);
  const { advocates, loading } = useAdvocates();

  // Initialize both filtered lists with all advocates
  useEffect(() => {
    setSearchFilteredAdvocates(advocates);
    setSpecialtyFilteredAdvocates(advocates);
  }, [advocates]);

  // Combine both filters
  const finalFilteredAdvocates = useMemo(() => {
    return advocates.filter(advocate => 
      searchFilteredAdvocates.includes(advocate) && 
      specialtyFilteredAdvocates.includes(advocate)
    );
  }, [advocates, searchFilteredAdvocates, specialtyFilteredAdvocates]);

  return (
    <main className="m-4">
      <h1 className="text-2xl font-bold mb-4">Solace Advocates</h1>
      
      <div className="space-y-6">
        <SearchFilters 
          advocates={advocates} 
          onFilterChange={setSearchFilteredAdvocates} 
        />
        
        <SpecialitiesFilter
          advocates={advocates}
          onFilterChange={setSpecialtyFilteredAdvocates}
        />
        
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : (
          <AdvocatesTable advocates={finalFilteredAdvocates} />
        )}
      </div>
    </main>
  );
}
