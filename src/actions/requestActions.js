"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { requestSchema } from "@/schemas/requestSchemas"; // Updated import to requestSchema
import { z } from "zod";

export const getRequestsAction = actionClient
  .schema(
    z.object({
      skip: z.number().optional(),
      limit: z.number().optional(),
      type: z.string().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const requests = await prisma.request.findMany({
      where: parsedInput.type ? { type: parsedInput.type } : undefined,
      orderBy: { updatedAt: "desc" },
      include: {
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
  });

export const getRequestByIdAction = actionClient
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const request = await prisma.request.findUnique({
      where: { id: parsedInput.id },
      include: {
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
        requestItems: true,
        submittedBy: true,
        budgetApprovedBy: true,
        financeApprovedBy: true,
      },
    });
    const activities = await prisma.activity.findMany({
      include: { workplan: true },
    });
    return { request, activities, success: true };
  });

export const createRequestAction = actionClient
  .schema(requestSchema.omit({ id: true })) // Updated to use requestSchema
  .action(async ({ parsedInput }) => {
    const request = await prisma.request.create({ data: parsedInput });

    return { request, success: true };
  });

export const updateRequestAction = actionClient
  .schema(requestSchema) // Updated to use requestSchema
  .action(async ({ parsedInput }) => {
    const request = await prisma.request.update({
      where: { id: parsedInput.id },
      data: parsedInput,
    });
    return { request, success: true };
  });
