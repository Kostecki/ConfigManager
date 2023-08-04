import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    // Get project configs
    const projectId = req.query.projectId as string;

    if (projectId) {
      const config = await prisma.config.findMany({
        where: {
          projectId: parseInt(projectId),
        },
      });

      if (req.headers["update-last-seen"]) {
        const shouldUpdate = Boolean(req.headers["update-last-seen"]);
        if (shouldUpdate) {
          await prisma.project.update({
            where: {
              id: parseInt(projectId),
            },
            data: {
              lastSeen: new Date(),
            },
          });
        }
      }

      return res.send(config);
    } else {
      res.status(400).json({ msg: "A project id is required" });
    }
  }
}
