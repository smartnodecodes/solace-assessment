"use client";

import { useEffect, useState, useMemo } from "react";
import LocalFont  from "next/font/local";
import { Loader2 } from "lucide-react";

const mollie = LocalFont({
  src: "../../public/mollie-glaston.otf",
  display: "swap",
});

import useAdvocates from "@/hooks/useAdvocates";

import SearchFilters from "@/components/SearchFilters";
import SpecialitiesFilter from "@/components/SpecialitiesFilter";
import AdvocatesTable from "@/components/AdvocatesTable";

import type { Advocate } from "@/types/global";

export default function Home() {
  const [searchFilteredAdvocates, setSearchFilteredAdvocates] = useState<Advocate[]>([]);
  const [specialtyFilteredAdvocates, setSpecialtyFilteredAdvocates] = useState<Advocate[]>([]);
  const { advocates, loading } = useAdvocates();

  useEffect(() => {
    setSearchFilteredAdvocates(advocates);
    setSpecialtyFilteredAdvocates(advocates);
  }, [advocates]);

  const finalFilteredAdvocates = useMemo(() => {
    return advocates.filter(advocate => 
      searchFilteredAdvocates.includes(advocate) && 
      specialtyFilteredAdvocates.includes(advocate)
    );
  }, [advocates, searchFilteredAdvocates, specialtyFilteredAdvocates]);

  return (
    <main className="m-4">
      <div className="flex flex-col md:flex-row justify-between mb-2">
      <h1 className={`${mollie.className} text-3xl text-white mb-4`}>Solace Advocates</h1>
        <SearchFilters 
          advocates={advocates} 
          onFilterChange={setSearchFilteredAdvocates} 
        />
      </div>

      
      <div className="space-y-6">

      
        <SpecialitiesFilter
          advocates={advocates}
          onFilterChange={setSpecialtyFilteredAdvocates}
        />
        
        {loading ? (
          <div className="flex items-center justify-center h-screen text-white">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : (
          <AdvocatesTable advocates={finalFilteredAdvocates} />
        )}
      </div>
    </main>
  );
}
