import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

import type { Advocate } from "@/types/global";

import { formatPhoneNumber, getSpecialtyInfo } from "@/lib/format";

type SortDirection = "asc" | "desc" | null;
type SortableColumn = "firstName" | "lastName" | "city" | "degree" | "yearsOfExperience" | "phoneNumber";

export default function AdvocatesTable({ advocates }: { advocates: Advocate[] }) {
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedAdvocates = [...advocates].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc"
        ? aValue - bValue
        : bValue - aValue;
    }

    return 0;
  });

  const SortIcon = ({ column }: { column: SortableColumn }) => {
    if (sortColumn !== column) return <ChevronsUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advocates</CardTitle>
        <CardDescription>Showing {advocates.length} advocates</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 ${sortColumn === "firstName" ? "bg-blue-300/50" : ""}`}
                onClick={() => handleSort("firstName")}
              >
                <div className="flex items-center gap-1">
                  First Name
                  <SortIcon column="firstName" />
                </div>
              </TableHead>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 ${sortColumn === "lastName" ? "bg-blue-300/50" : ""}`}
                onClick={() => handleSort("lastName")}
              >
                <div className="flex items-center gap-1">
                  Last Name
                  <SortIcon column="lastName" />
                </div>
              </TableHead>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 ${sortColumn === "city" ? "bg-blue-300/50" : ""}`}
                onClick={() => handleSort("city")}
              >
                <div className="flex items-center gap-1">
                  City
                  <SortIcon column="city" />
                </div>
              </TableHead>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 ${sortColumn === "degree" ? "bg-blue-300/50" : ""}`}
                onClick={() => handleSort("degree")}
              >
                <div className="flex items-center gap-1">
                  Degree
                  <SortIcon column="degree" />
                </div>
              </TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 ${sortColumn === "yearsOfExperience" ? "bg-blue-300/50" : ""}`}
                onClick={() => handleSort("yearsOfExperience")}
              >
                <div className="flex items-center gap-1">
                  Years of Experience
                  <SortIcon column="yearsOfExperience" />
                </div>
              </TableHead>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 ${sortColumn === "phoneNumber" ? "bg-blue-300/50" : ""}`}
                onClick={() => handleSort("phoneNumber")}
              >
                <div className="flex items-center gap-1">
                  Phone Number
                  <SortIcon column="phoneNumber" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAdvocates.length > 0 ? sortedAdvocates.map((advocate) => (
              <TableRow key={advocate.id}>
                <TableCell className={`font-mono ${sortColumn === "firstName" ? "bg-blue-100" : ""}`}>{advocate.firstName}</TableCell>
                <TableCell className={`font-mono ${sortColumn === "lastName" ? "bg-blue-100" : ""}`}>{advocate.lastName}</TableCell>
                <TableCell className={`font-mono ${sortColumn === "city" ? "bg-blue-100" : ""}`}>{advocate.city}</TableCell>
                <TableCell className={`font-mono ${sortColumn === "degree" ? "bg-blue-100" : ""}`}>{advocate.degree}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <TooltipProvider>
                      {(advocate.specialties || []).map((specialty) => {
                        const { color, title, description } = getSpecialtyInfo(specialty);
                        return (
                          <Tooltip key={specialty}>
                            <TooltipTrigger asChild>
                              <span
                                className={`${color} w-3 h-3 rounded-full`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex flex-col gap-1">
                                <p className="font-mono">{title}</p>
                                {description && (
                                  <p className="text-sm text-muted-foreground">{description}</p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell className={`font-mono ${sortColumn === "yearsOfExperience" ? "bg-blue-100" : ""}`}>{advocate.yearsOfExperience}</TableCell>
                <TableCell className={`font-mono ${sortColumn === "phoneNumber" ? "bg-blue-100" : ""}`}>{formatPhoneNumber(advocate.phoneNumber || "")}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">No advocates found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
