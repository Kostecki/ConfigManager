import { drizzle } from "drizzle-orm/libsql";
import { invariant } from "~/utils/invariant";

import { projects, keyValuePairs, voltages } from "./schema.server";

const DATABASE_PATH = process.env.DATABASE_PATH;
const MIGRATIONS_PATH = process.env.MIGRATIONS_PATH;
invariant(DATABASE_PATH, "DATABASE_PATH is not defined");
invariant(MIGRATIONS_PATH, "MIGRATIONS_PATH is not defined");

export const db = drizzle(DATABASE_PATH, {
  schema: {
    projects,
    keyValuePairs,
    voltages,
  },
});
