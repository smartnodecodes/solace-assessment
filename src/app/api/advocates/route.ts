import { NextResponse } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";
// import { advocateData } from "../../../db/seed/advocates";

export async function GET() {
  try {    
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    const data = await db.select().from(advocates);
    console.log("Retrieved advocates:", data);

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
