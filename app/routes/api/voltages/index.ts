import { createVoltageReadings, getVoltageReadings } from "~/database/utils";
import type { Route } from "./+types";

export async function action({ request, params }: Route.ActionArgs) {
  const { projectId } = params;
  const parsedProjectId = Number.parseInt(projectId ?? "", 10);

  const data = await request.json();

  if (parsedProjectId !== data.projectId) {
    return {
      status: "error",
      message: "Project ID in request does not match URL parameter",
    };
  }

  return await createVoltageReadings(data);
}

export async function loader({ params }: Route.LoaderArgs) {
  const { projectId } = params;
  const parsedProjectId = Number.parseInt(projectId ?? "", 10);

  return await getVoltageReadings(parsedProjectId);
}
