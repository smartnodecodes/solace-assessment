import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { ALL_SPECIALTIES, getSpecialtyInfo } from "@/lib/format";

export default function SpecialtiesFilter({
  selectedSpecialties,
  onSpecialtiesChange
}: {
  selectedSpecialties: string[];
  onSpecialtiesChange: (specialties: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Filter by Specialties</h3>
          <p className="text-sm text-gray-500">Filter advocates by their specialties
            <br/><span className="text-xs text-gray-300">({selectedSpecialties?.length} selected)</span>
          </p>
        </div>
        <Button variant="outline" onClick={() => onSpecialtiesChange([])}>Clear</Button>
      </div>

      <ToggleGroup
        type="multiple"
        value={selectedSpecialties}
        onValueChange={onSpecialtiesChange}
        className="flex flex-wrap gap-2"
      >
        {ALL_SPECIALTIES.map((specialty) => {
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