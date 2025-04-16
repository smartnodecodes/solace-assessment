
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

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
        <div className="relative w-full">
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
            <SearchIcon className="h-4 w-4" />
          </div>
          <Input
            type="text"
            placeholder="Search advocates..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-white text-black/90 pl-8"
          />
        </div>
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