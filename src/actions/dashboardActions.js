"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { getServerSession } from "next-auth";
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
    const session = await getServerSession(authOptions);
    const user = session.user;

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
          requestItems: true,
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
        include: { workplan: true, project: true },
      });
      const projects = await prisma.project.findMany({
        include: { donor: true },
      });
      const donors = await prisma.donor.findMany();
      return {
        requests,
        totalRequests,
        activities,
        projects,
        donors,
        success: true,
      };
    } else {
      const requests = await prisma.request.findMany({
        where: parsedInput.type
          ? { type: parsedInput.type, unitId: user.unitId }
          : { unitId: user.unitId },
        orderBy: { updatedAt: "desc" },
        include: {
          unit: true,
          requestItems: true,
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
        include: { workplan: true, project: true },
      });
      const projects = await prisma.project.findMany({
        include: { donor: true },
      });
      const donors = await prisma.donor.findMany();
      return {
        requests,
        totalRequests,
        activities,
        projects,
        donors,
        success: true,
      };
    }
  });
