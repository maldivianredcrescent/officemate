"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

export const getDashboardRequestsAction = actionClient
  .schema(
    z.object({
      skip: z.number().optional(),
      limit: z.number().optional(),
      type: z.string().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const clearances = await prisma.clearance.findMany({
      where: parsedInput.type ? { type: parsedInput.type } : undefined,
      orderBy: { updatedAt: "desc" },
      include: {
        request: {
          include: {
            activity: true,
            requestItems: true,
          },
        },
      },
      skip: parsedInput.skip,
      take: parsedInput.limit,
    });

    const totalClearances = await prisma.clearance.count({
      where: parsedInput.type ? { type: parsedInput.type } : undefined,
    });
    return { clearances, totalClearances, success: true };
  });
