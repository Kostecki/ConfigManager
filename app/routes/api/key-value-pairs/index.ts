import type { Route } from "./+types";
import {
  createKeyValuePair,
  editKeyValuePair,
  deleteKeyValuePairs,
  getKeyValuePairs,
} from "~/database/utils";

export async function action({ request, params }: Route.ActionArgs) {
  const { projectId } = params;
  const parsedProjectId = Number.parseInt(projectId ?? "", 10);

  switch (request.method) {
    case "POST": {
      const data = await request.json();

      return await createKeyValuePair(data);
    }
    case "PUT": {
      if (!parsedProjectId) {
        return {
          status: "error",
          message: "Missing projectId for update",
        };
      }

      const data = await request.json();

      return await editKeyValuePair({ id: parsedProjectId, ...data });
    }

    case "DELETE": {
      if (!parsedProjectId) {
        return {
          status: "error",
          message: "Missing projectId for deletion",
        };
      }

      return await deleteKeyValuePairs(parsedProjectId);
    }

    default:
      return {
        status: "error",
        message: "Unsupported request method",
      };
  }
}

export async function loader({ params }: Route.LoaderArgs) {
  const { projectId } = params;
  const parsedProjectId = Number.parseInt(projectId ?? "", 10);

  if (!parsedProjectId) {
    return {
      status: "error",
      message: "Missing projectId for loading",
    };
  }

  // Here you would typically fetch the key-value pair from the database
  // For now, we return a placeholder response
  return await getKeyValuePairs(parsedProjectId);
}
