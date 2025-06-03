import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  repoLink: text("repo_link"),
  lastSeen: text("last_seen"),
  batteryProject: integer("battery_project", { mode: "boolean" }).default(
    false
  ),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  lastUpdatedAt: text("last_updated_at").$onUpdate(
    () => sql`(CURRENT_TIMESTAMP)`
  ),
});

export const keyValuePairs = sqliteTable("key_value_pairs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  enabled: integer("enabled", { mode: "boolean" }).default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  lastUpdatedAt: text("last_updated_at").$onUpdate(
    () => sql`(CURRENT_TIMESTAMP)`
  ),
  projectId: integer("project_id").references(() => projects.id),
});

export const voltages = sqliteTable("voltages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reading: integer("reading").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  projectId: integer("project_id").references(() => projects.id),
});
