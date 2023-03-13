import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Get project
    const projectId = req.query.projectId as string;

    if (projectId) {
      try {
        const project = await prisma.project.findUniqueOrThrow({
          where: {
            id: parseInt(projectId),
          },
        });

        const configs = await prisma.config.findMany({
          where: {
            projectId: parseInt(projectId),
          },
        });

        const payload = { ...project, configs };

        return res.json(payload);
      } catch (e: any) {
        if (e.code === "P2025") {
          return res.json([]);
        } else {
          return res.json({
            errorMsg: "Something went wrong 🤷‍♂️",
          });
        }
      }
    } else {
      res.status(400).json({ msg: "A project id is required" });
    }
  } else if (req.method === "PUT") {
    // Update  project
    const inputProject = JSON.parse(req.body);

    if (inputProject.id) {
      try {
        const updateProject = await prisma.project.update({
          where: {
            id: inputProject.id,
          },
          data: inputProject,
        });

        return res.json(updateProject);
      } catch (e: any) {
        if (e.code === "P2025") {
          return res.json([]);
        } else {
          return res.json({
            errorMsg: "Something went wrong 🤷‍♂️",
          });
        }
      }
    } else {
      res.status(400).json({ msg: "A project id is required" });
    }
  } else if (req.method === "DELETE") {
    // Delete project
    const projectId = req.query.projectId as string;

    if (projectId) {
      try {
        const deleteProject = await prisma.project.delete({
          where: {
            id: parseInt(projectId),
          },
        });

        res.json(deleteProject);
      } catch (e: any) {
        if (e.code === "P2025") {
          return res.json([]);
        } else {
          return res.json({
            errorMsg: "Something went wrong 🤷‍♂️",
          });
        }
      }
    } else {
      res.status(400).json({ msg: "A project id is required" });
    }
  }
}
