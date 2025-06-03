import { deleteProject, editProject } from "~/database/utils";

import type { Route } from "./+types/project";

export async function action({ request, params }: Route.ActionArgs) {
  const { projectId } = params;
  const parsedProjectId = Number.parseInt(projectId, 10);

  switch (request.method) {
    case "PATCH": {
      const formData = await request.formData();
      const projectName = formData.get("projectName")?.toString();
      const repoLink = formData.get("repoLink")?.toString();
      const batteryProject = formData.get("batteryProject") === "true";

      const projectUpdate = {
        id: parsedProjectId,
        name: projectName || undefined,
        repoLink: repoLink || undefined,
        batteryProject,
      };

      return await editProject(projectUpdate);
    }
    case "DELETE": {
      return await deleteProject(parsedProjectId);
    }
  }
}
