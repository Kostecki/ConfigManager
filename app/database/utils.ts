import { eq, type InferInsertModel } from "drizzle-orm";

import { db } from "./config.server";
import { keyValuePairs, projects, voltages } from "./schema.server";

import type {
  InsertKeyValuePairs,
  InsertProjects,
  InsertVoltages,
  SelectProjects,
  SelectProjectsFull,
} from "./schema.types";

export const getProjects = async (
  full: boolean
): Promise<SelectProjects[] | SelectProjectsFull[]> => {
  try {
    const allProjects = await db.select().from(projects);

    if (!full) return allProjects;

    const allKeyValuePairs = await db.select().from(keyValuePairs);
    const allVoltages = await db.select().from(voltages);

    return allProjects.map((project) => ({
      ...project,
      keyValuePairs: allKeyValuePairs.filter(
        (kv) => kv.projectId === project.id
      ),
      voltages: allVoltages.filter((v) => v.projectId === project.id),
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const createProject = async (project: InsertProjects) => {
  try {
    await db.insert(projects).values(project);

    return {
      status: "success",
      message: "Project created successfully.",
    };
  } catch (error) {
    console.error("Error creating project:", error);

    return {
      status: "error",
      message: "Error creating project.",
    };
  }
};

type ProjectUpdate = Partial<InferInsertModel<typeof projects>> & {
  id: number;
};
export const editProject = async (projectUpdate: ProjectUpdate) => {
  const { id, ...updateData } = projectUpdate;

  try {
    await db.update(projects).set(updateData).where(eq(projects.id, id));

    return {
      status: "success",
      message: "Project updated successfully.",
    };
  } catch (error) {
    console.error("Error updating project:", error);

    return {
      status: "error",
      message: "Error updating project.",
    };
  }
};

export const deleteProject = async (projectId: number) => {
  try {
    console.log("Deleting project with ID:", projectId);
    await deleteKeyValuePairs(projectId);
    await deleteVoltageReadings(projectId);
    await db.delete(projects).where(eq(projects.id, projectId));

    return {
      status: "success",
      message: "Project deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting project:", error);

    return {
      status: "error",
      message: "Error deleting project.",
    };
  }
};

export const getKeyValuePairs = async (projectId: number) => {
  try {
    const kvPairs = await db
      .select()
      .from(keyValuePairs)
      .where(eq(keyValuePairs.projectId, projectId));

    return kvPairs;
  } catch (error) {
    console.error("Error fetching key-value pairs:", error);
    return [];
  }
};

export const createKeyValuePair = async (kv: InsertKeyValuePairs) => {
  try {
    await db.insert(keyValuePairs).values(kv);

    return {
      status: "success",
      message: "Key-value pair created successfully.",
    };
  } catch (error) {
    console.error("Error creating key-value pair:", error);
    return { status: "error", message: "Failed to create key-value pair." };
  }
};

type KeyValueUpdate = Partial<InferInsertModel<typeof keyValuePairs>> & {
  id: number;
};
export const editKeyValuePair = async (kvUpdate: KeyValueUpdate) => {
  const { id, ...updateData } = kvUpdate;

  try {
    await db
      .update(keyValuePairs)
      .set(updateData)
      .where(eq(keyValuePairs.id, id));

    return {
      status: "success",
      message: "Key-value pair updated successfully.",
    };
  } catch (error) {
    console.error("Error updating key-value pair:", error);
    return { status: "error", message: "Failed to update key-value pair." };
  }
};

export const deleteKeyValuePairs = async (projectId: number) => {
  console.log("Deleting key-value pairs for project ID:", projectId);

  try {
    await db
      .delete(keyValuePairs)
      .where(eq(keyValuePairs.projectId, projectId));

    return {
      status: "success",
      message: "Key-value pairs deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting key-value pairs:", error);
    return { status: "error", message: "Error deleting key-value pairs." };
  }
};

export const createVoltageReadings = async (data: InsertVoltages) => {
  try {
    await db.insert(voltages).values(data);

    return {
      status: "success",
      message: "Voltage readings created successfully.",
    };
  } catch (error) {
    console.error("Error creating voltage readings:", error);
    return { status: "error", message: "Error creating voltage readings." };
  }
};

export const deleteVoltageReadings = async (projectId: number) => {
  console.log("Deleting voltage readings for project ID:", projectId);

  try {
    await db.delete(voltages).where(eq(voltages.projectId, projectId));

    return {
      status: "success",
      message: "Voltage readings deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting voltage readings:", error);
    return { status: "error", message: "Error deleting voltage readings." };
  }
};
