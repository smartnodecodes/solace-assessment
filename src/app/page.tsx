"use client";

import { useEffect, useState, useMemo } from "react";
import LocalFont from "next/font/local";
import { Loader2, Filter } from "lucide-react";

const mollie = LocalFont({
  src: "../../public/mollie-glaston.otf",
  display: "swap",
});

import useAdvocates from "@/hooks/useAdvocates";

import SearchFilters from "@/components/SearchFilters";
import SpecialitiesFilter from "@/components/SpecialitiesFilter";
import AdvocatesTable from "@/components/AdvocatesTable";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import type { Advocate } from "@/types/global";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilteredAdvocates, setSearchFilteredAdvocates] = useState<Advocate[]>([]);
  const [specialtyFilteredAdvocates, setSpecialtyFilteredAdvocates] = useState<Advocate[]>([]);
  const { advocates, pagination, loading } = useAdvocates(currentPage);

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <main className="m-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className={`${mollie.className} text-3xl text-white`}>Solace Advocates</h1>
        <div className="flex items-start gap-2">
          <SearchFilters
            advocates={advocates}
            onFilterChange={setSearchFilteredAdvocates}
          />
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <SpecialitiesFilter
                advocates={advocates}
                onFilterChange={setSpecialtyFilteredAdvocates}
              />
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-screen text-white">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <AdvocatesTable 
          advocates={finalFilteredAdvocates} 
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
