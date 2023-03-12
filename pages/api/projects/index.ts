import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Get project
    const projects = await prisma.project.findMany({});

    return res.json(projects);
  } else if (req.method === "POST") {
    // Create project
    console.log(req.body);
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
