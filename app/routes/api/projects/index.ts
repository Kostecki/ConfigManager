import { db } from "~/database/config.server";
import { projects } from "~/database/schema.server";

import type { Route } from "./+types/index";
import { createProject } from "~/database/utils";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const projectName = formData.get("projectName");
  const repoLink = formData.get("repoLink");
  const batteryProject = formData.get("batteryProject");

  if (!projectName) {
    return {
      status: "error",
      message: "Project name is required.",
    };
  }

  const newProject = {
    name: projectName.toString(),
    repoLink: repoLink ? repoLink.toString() : undefined,
    batteryProject: batteryProject?.toString() === "true",
  };

  return await createProject(newProject);
}

export async function loader() {
  return await db.select().from(projects);
}
