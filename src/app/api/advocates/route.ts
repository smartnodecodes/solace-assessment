import { NextResponse } from "next/server";
import db from "@/db";
import { advocates } from "@/db/schema";
import { ALL_SPECIALTIES } from "@/lib/format";
// import { advocateData } from "../../../db/seed/advocates";

interface DbAdvocate {
  id: string;
  payload: string[];
  [key: string]: any;
}

export async function GET() {
  try {    
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    const data = await db.select().from(advocates) as DbAdvocate[];

    const allSpecialties = new Set<string>();
    data.forEach(advocate => {
      (advocate.payload || []).forEach((specialty: string) => {
        allSpecialties.add(specialty);
      });
    });

    console.log("All specialties:", allSpecialties);

    const unknownSpecialties = Array.from(allSpecialties).filter(
      specialty => !ALL_SPECIALTIES.includes(specialty)
    );

    if (unknownSpecialties.length > 0) {
      console.log("Unknown specialties found in database:", unknownSpecialties);
    }

    if (!data || data.length === 0) {
      console.log("No advocates found in database");
      return NextResponse.json({ data: [] });
    }

    // Transform the data to match the expected format
    const transformedData = data.map(advocate => ({
      ...advocate,
      specialties: advocate.payload || [],
    }));

    return NextResponse.json({ data: transformedData });
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return NextResponse.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, city, degree, specialties, yearsOfExperience, phoneNumber } = body;

    // Validate required fields
    if (!firstName || !lastName || !city || !degree || !specialties || !yearsOfExperience) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [newAdvocate] = await db.insert(advocates).values({
      firstName,
      lastName,
      city,
      degree,
      payload: specialties,
      yearsOfExperience,
      phoneNumber: phoneNumber || null,
    }).returning();

    return NextResponse.json({ data: newAdvocate }, { status: 201 });
  } catch (error) {
    console.error("Error creating advocate:", error);
    return NextResponse.json(
      { error: "Failed to create advocate" },
      { status: 500 }
    );
  }
}
