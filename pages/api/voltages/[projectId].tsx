import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const projectId = req.query.projectId as string;

    if (projectId) {
      const voltages = await prisma.voltages.findMany({
        where: {
          projectId: parseInt(projectId),
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.send(voltages);
    }
  } else if (req.method === "PUT") {
    const reading = req.body;
    const insert = await prisma.voltages.create({
      data: reading,
    });

    return res.json(insert);
  }
}
