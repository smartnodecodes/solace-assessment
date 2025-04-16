
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";

import type { Advocate } from "@/types/global";

import { formatPhoneNumber, getSpecialtyColor } from "@/lib/format";

export default function AdvocatesTable({ advocates }: { advocates: Advocate[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Advocates</CardTitle>
                <CardDescription>List of advocates</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>First Name</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Degree</TableHead>
                            <TableHead>Specialties</TableHead>
                            <TableHead>Years of Experience</TableHead>
                            <TableHead>Phone Number</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {advocates.map((advocate) => (
                            <TableRow key={advocate.id}>
                                <TableCell>{advocate.firstName}</TableCell>
                                <TableCell>{advocate.lastName}</TableCell>
                                <TableCell>{advocate.city}</TableCell>
                                <TableCell>{advocate.degree}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {advocate.specialties.map((specialty) => (
                                            <span
                                                key={specialty}
                                                className={`${getSpecialtyColor(specialty)} text-white px-2 py-1 rounded-full text-xs`}
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>{advocate.yearsOfExperience}</TableCell>
                                <TableCell>{formatPhoneNumber(advocate.phoneNumber || "")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
