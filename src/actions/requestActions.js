"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { requestSchema } from "@/schemas/requestSchemas"; // Updated import to requestSchema
import { getServerSession } from "next-auth";
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
        unit: true,
        requestItems: true,
        submittedBy: true,
        budgetApprovedBy: true,
        financeApprovedBy: true,
        completedBy: true,
      },
    });

    const totalAmount = request.requestItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const activities = await prisma.activity.findMany({
      include: { workplan: true },
    });
    return { request, totalAmount, activities, success: true };
  });

export const createRequestAction = actionClient
  .schema(requestSchema.omit({ id: true }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.request.create({
      data: { ...parsedInput, createdById: user.id, unitId: user.unitId },
    });

    return { request, success: true };
  });

export const updateRequestAction = actionClient
  .schema(requestSchema)
  .action(async ({ parsedInput }) => {
    const request = await prisma.request.update({
      where: { id: parsedInput.id },
      data: parsedInput,
    });
    return { request, success: true };
  });

export const submitRequestForApprovalAction = actionClient
  .schema(z.object({ id: z.string(), signature: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.request.update({
      where: { id: parsedInput.id },
      data: {
        status: "submitted",
        submittedAt: new Date(),
        submittedById: user.id,
        submittedSignature: parsedInput.signature,
      },
    });
    return { request, success: true };
  });

export const submitRequestForBudgetApprovalAction = actionClient
  .schema(z.object({ id: z.string(), signature: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.request.update({
      where: { id: parsedInput.id },
      data: {
        status: "budget_approved",
        budgetApprovedAt: new Date(),
        budgetApprovedById: user.id,
        budgetApprovedSignature: parsedInput.signature,
      },
    });
    return { request, success: true };
  });

export const submitRequestForFinanceApprovalAction = actionClient
  .schema(z.object({ id: z.string(), signature: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.request.update({
      where: { id: parsedInput.id },
      data: {
        status: "finance_approved",
        financeApprovedAt: new Date(),
        financeApprovedById: user.id,
        financeApprovedSignature: parsedInput.signature,
      },
    });
    return { request, success: true };
  });

export const completedRequestAction = actionClient
  .schema(z.object({ id: z.string(), signature: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.request.update({
      where: { id: parsedInput.id },
      data: {
        status: "completed",
        completedAt: new Date(),
        completedById: user.id,
        completedSignature: parsedInput.signature,
      },
    });

    if (request.type === "working_advance") {
      await prisma.clearance.create({
        data: {
          requestId: parsedInput.id,
          submittedById: user.id,
          submittedAt: new Date(),
        },
      });
    }

    return { request, success: true };
  });

export const rejectRequestAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.request.update({
      where: { id: parsedInput.id },
      data: {
        status: "rejected",
        rejectedAt: new Date(),
        rejectedById: user.id,
      },
    });
    return { request, success: true };
  });
