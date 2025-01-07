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
    if (
      [
        "admin",
        "budget_approver",
        "finance_approver",
        "payment_processor",
      ].includes(user.role)
    ) {
      const requests = await prisma.request.findMany({
        where: parsedInput.type ? { type: parsedInput.type } : undefined,
        orderBy: { updatedAt: "desc" },
        include: {
          unit: true,
          activity: {
            include: {
              workplan: true,
              project: {
                include: {
                  donor: true,
                },
              },
            },
          },
        },
        skip: parsedInput.skip,
        take: parsedInput.limit,
      });

      const totalRequests = await prisma.request.count({
        where: parsedInput.type ? { type: parsedInput.type } : undefined,
      });
      const activities = await prisma.activity.findMany({
        include: { workplan: true },
      });
      return { requests, totalRequests, activities, success: true };
    } else {
      const requests = await prisma.request.findMany({
        where: parsedInput.type
          ? { type: parsedInput.type, unitId: user.unitId }
          : { unitId: user.unitId },
        orderBy: { updatedAt: "desc" },
        include: {
          unit: true,
          activity: {
            include: {
              workplan: true,
              project: {
                include: {
                  donor: true,
                },
              },
            },
          },
        },
        skip: parsedInput.skip,
        take: parsedInput.limit,
      });

      const totalRequests = await prisma.request.count({
        where: parsedInput.type ? { type: parsedInput.type } : undefined,
      });
      const activities = await prisma.activity.findMany({
        include: { workplan: true },
      });
      return { requests, totalRequests, activities, success: true };
    }
  });
