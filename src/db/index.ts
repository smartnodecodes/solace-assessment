import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

let db: PostgresJsDatabase;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  throw new Error("DATABASE_URL is not set");
}

// for query purposes
const queryClient = postgres(process.env.DATABASE_URL);
db = drizzle(queryClient);

export default db;
