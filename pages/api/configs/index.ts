import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    // Upsert configs
    const configs = req.body;
    const filtered = configs.updated.filter(
      (conf: any) => !configs.deleted.includes(conf.id)
    );

    const updates = filtered.map((conf: any) => {
      if (conf.id) {
        // Id exists - update
        return prisma.config.update({
          where: { id: conf.id },
          data: {
            label: conf.label,
            key: conf.key,
            value: conf.value.toString(),
            enabled: conf.enabled,
            projectId: conf.projectId,
          },
        });
      } else {
        // Id doesn't exist - create new
        return prisma.config.create({
          data: {
            label: conf.label,
            key: conf.key,
            value: conf.value.toString(),
            enabled: conf.enabled,
            projectId: conf.projectId,
          },
        });
      }
    });

    const deletions = configs.deleted.map((configId: number) => {
      return prisma.config.delete({
        where: {
          id: configId,
        },
      });
    });

    const configChanges = await prisma.$transaction([...updates, ...deletions]);
    return res.json(configChanges);
  }
}
