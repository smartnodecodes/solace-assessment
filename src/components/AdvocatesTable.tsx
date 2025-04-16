import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronUp, ChevronDown, ChevronsUpDown, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddAdvocateForm from "@/components/AddAdvocateForm";

import type { Advocate } from "@/types/global";
import { formatPhoneNumber, getSpecialtyInfo, Specialty } from "@/lib/format";

type SortDirection = "asc" | "desc" | null;
type SortableColumn = "firstName" | "lastName" | "city" | "degree" | "yearsOfExperience" | "phoneNumber";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function AdvocatesTable({
  advocates,
  pagination,
  onPageChange
}: {
  advocates: Advocate[];
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}) {
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <CardTitle>Advocates</CardTitle>
            <CardDescription>
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} entries
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Advocate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Advocate</DialogTitle>
            </DialogHeader>
            <AddAdvocateForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
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
                        const { color, title, description } = getSpecialtyInfo(specialty as Specialty);
                        return (
                          <Tooltip key={specialty}>
                            <TooltipTrigger asChild>
                              <span
                                className={`${color} w-3 h-3 rounded-full inline-block cursor-pointer`}
                                aria-label={title}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex flex-col gap-1 text-xs">
                                <p className="font-bold">{title}</p>
                                {description && (
                                  <p className="text-muted-foreground">{description}</p>
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
    </Card >
  );
}
