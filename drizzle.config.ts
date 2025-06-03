import { defineConfig } from "drizzle-kit";

import { invariant } from "~/utils/invariant";

const DATABASE_PATH = process.env.DATABASE_PATH;
const MIGRATIONS_PATH = process.env.MIGRATIONS_PATH;
invariant(DATABASE_PATH, "DATABASE_PATH is not defined");
invariant(MIGRATIONS_PATH, "MIGRATIONS_PATH is not defined");

export default defineConfig({
  out: MIGRATIONS_PATH,
  schema: "./app/database/schema.server.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: DATABASE_PATH,
  },
});
