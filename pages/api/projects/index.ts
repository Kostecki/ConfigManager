import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    // Get project
    const projects = await prisma.project.findMany({
      include: {
        Voltages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return res.json(projects);
  } else if (req.method === "POST") {
    // Create project
    const { name, githubLink } = req.body;

    const result = await prisma.project.create({
      data: {
        name,
        githubLink,
      },
    });

    return res.json(result);
  }
}
