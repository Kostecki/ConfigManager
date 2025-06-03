import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";

import { invariant } from "~/utils/invariant";

import { projects, keyValuePairs, voltages } from "./schema.server";

const DATABASE_PATH = process.env.DATABASE_PATH;
const MIGRATIONS_PATH = process.env.MIGRATIONS_PATH;
invariant(DATABASE_PATH, "DATABASE_PATH is not defined");
invariant(MIGRATIONS_PATH, "MIGRATIONS_PATH is not defined");

export const db = drizzle(new Database(DATABASE_PATH), {
  schema: {
    projects,
    keyValuePairs,
    voltages,
  },
});

const setupDatabase = async () => {
  migrate(db, {
    migrationsFolder: MIGRATIONS_PATH,
  });
};

setupDatabase().catch((error) => {
  console.error("Error setting up the database:", error);
  process.exit(1);
});
