import { NextResponse, NextRequest } from "next/server";
import db from "@/db";
import { advocates } from "@/db/schema";
import { ALL_SPECIALTIES } from "@/lib/format";
import { sql } from "drizzle-orm";
import type { Advocate } from "@/types/global";

interface DbAdvocate {
  id: number;
  payload: string[] | null;
  first_name: string;
  last_name: string;
  city: string;
  degree: string;
  years_of_experience: number;
  phone_number: number;
  created_at: Date | null;
}

export async function GET(request: NextRequest) {
  try {    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    // Build the search query
    let whereClause = '';
    if (search) {
      const searchTerm = `'%${search}%'`;
      whereClause = `WHERE CONCAT(first_name, last_name, ' ', city, ' ', degree) ILIKE ${searchTerm}`;
    } else {
      whereClause = '';
    }

    // Get total count
    const [{ count }] = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM advocates
      ${sql.raw(whereClause)}
    `);

    const totalPages = Math.ceil(Number(count) / limit);

    // Get paginated data
    const data = (await db.execute(sql`
      SELECT *
      FROM advocates
      ${sql.raw(whereClause)}
      LIMIT ${limit}
      OFFSET ${offset}
    `)) as unknown as DbAdvocate[];

    if (!data || data.length === 0) {
      console.log("No advocates found in database");
      return NextResponse.json({ 
        data: [],
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: Number(count),
          itemsPerPage: limit
        }
      });
    }

    // Transform the data to match the Advocate type
    const transformedData: Advocate[] = data.map(advocate => {
      // Ensure payload is properly parsed and is an array
      let specialties: string[] = [];
      try {
        if (typeof advocate.payload === 'string') {
          specialties = JSON.parse(advocate.payload);
        } else if (Array.isArray(advocate.payload)) {
          specialties = advocate.payload;
        }
      } catch (e) {
        console.error('Error parsing specialties:', e);
      }

      return {
        id: advocate.id,
        firstName: advocate.first_name,
        lastName: advocate.last_name,
        city: advocate.city,
        degree: advocate.degree,
        specialties,
        yearsOfExperience: advocate.years_of_experience,
        phoneNumber: advocate.phone_number.toString(),
      };
    });

    return NextResponse.json({ 
      data: transformedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: Number(count),
        itemsPerPage: limit
      }
    });
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

    // Ensure specialties is properly formatted as a JSON array
    const payload = Array.isArray(specialties) ? specialties : [specialties];

    const [newAdvocate] = (await db.execute(sql`
      INSERT INTO advocates (
        first_name,
        last_name,
        city,
        degree,
        payload,
        years_of_experience,
        phone_number
      ) VALUES (
        ${firstName},
        ${lastName},
        ${city},
        ${degree},
        ${JSON.stringify(payload)},
        ${yearsOfExperience},
        ${parseInt(phoneNumber) || null}
      )
      RETURNING *
    `)) as unknown as DbAdvocate[];

    // Transform the data to match the Advocate type
    const transformedAdvocate: Advocate = {
      id: newAdvocate.id,
      firstName: newAdvocate.first_name,
      lastName: newAdvocate.last_name,
      city: newAdvocate.city,
      degree: newAdvocate.degree,
      specialties: Array.isArray(newAdvocate.payload) ? newAdvocate.payload : [],
      yearsOfExperience: newAdvocate.years_of_experience,
      phoneNumber: newAdvocate.phone_number.toString(),
    };

    return NextResponse.json({ 
      data: transformedAdvocate
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating advocate:", error);
    return NextResponse.json(
      { error: "Failed to create advocate" },
      { status: 500 }
    );
  }
}
