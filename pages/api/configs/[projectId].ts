import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { encrypt } from "@/lib/aes";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
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

      // const cipherText = encrypt(JSON.stringify(config));

      return res.send(config);
    } else {
      res.status(400).json({ msg: "A project id is required" });
    }
  }
}
