import { eq } from "drizzle-orm";

import { db } from "~/database/config.server";
import { projects } from "~/database/schema.server";

import type { Route } from "./+types/ping";

export async function action({ params }: Route.ActionArgs) {
  const projectId = params.projectId;

  if (!projectId) {
    return {
      status: "error",
      message: "Project ID is required.",
    };
  }

  try {
    const result = await db
      .update(projects)
      .set({ lastSeen: new Date().toISOString() })
      .where(eq(projects.id, Number(projectId)));

    if (result.rowsAffected === 0) {
      return {
        status: "error",
        message: "No project found with the provided ID.",
      };
    }

    return {
      status: "success",
      message: `Ping received successfully for project: ${projectId}.`,
    };
  } catch (error) {
    console.error("Error updating project last seen:", error);

    return {
      status: "error",
      message: "Failed to update project last seen.",
    };
  }
}
