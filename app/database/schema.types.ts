import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { projects, keyValuePairs, voltages } from "./schema.server";

// Project Types
export type SelectProjects = InferSelectModel<typeof projects>;
export type InsertProjects = InferInsertModel<typeof projects>;

// Full Project (with related data)
export type SelectProjectsFull = SelectProjects & {
  keyValuePairs: SelectKeyValuePairs[];
  voltages: SelectVoltages[];
};

// KeyValuePairs Types
export type SelectKeyValuePairs = InferSelectModel<typeof keyValuePairs>;
export type InsertKeyValuePairs = InferInsertModel<typeof keyValuePairs>;

// Voltages Types
export type SelectVoltages = InferSelectModel<typeof voltages>;
export type InsertVoltages = InferInsertModel<typeof voltages>;
