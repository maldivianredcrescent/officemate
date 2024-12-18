"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const getClearanceRequestsAction = actionClient
  .schema(
    z.object({
      skip: z.number().optional(),
      limit: z.number().optional(),
      type: z.string().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const requests = await prisma.clearanceRequest.findMany({
      where: parsedInput.type ? { type: parsedInput.type } : undefined,
      orderBy: { updatedAt: "desc" },
      include: {
        requestItems: true,
      },
      skip: parsedInput.skip,
      take: parsedInput.limit,
    });

    const totalRequests = await prisma.clearanceRequest.count({
      where: parsedInput.type ? { type: parsedInput.type } : undefined,
    });
    return { requests, totalRequests, success: true };
  });

export const getClearanceRequestByIdAction = actionClient
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const request = await prisma.clearanceRequest.findUnique({
      where: { id: parsedInput.id },
      include: {
        result: true,
        requestItems: true,
        submittedBy: true,
        budgetApprovedBy: true,
        financeApprovedBy: true,
        completedBy: true,
      },
    });
    return { request, success: true };
  });

export const submitClearanceRequestForApprovalAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.clearanceRequest.update({
      where: { id: parsedInput.id },
      data: {
        status: "submitted",
        submittedAt: new Date(),
        submittedById: user.id,
      },
    });
    return { request, success: true };
  });

export const submitClearanceRequestForBudgetApprovalAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.clearance.update({
      where: { id: parsedInput.id },
      data: {
        status: "budget_approved",
        budgetApprovedAt: new Date(),
        budgetApprovedById: user.id,
      },
    });
    return { request, success: true };
  });

export const submitClearanceRequestForFinanceApprovalAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.clearance.update({
      where: { id: parsedInput.id },
      data: {
        status: "finance_approved",
        financeApprovedAt: new Date(),
        financeApprovedById: user.id,
      },
    });
    return { request, success: true };
  });

export const completeClearanceRequestAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.clearance.update({
      where: { id: parsedInput.id },
      data: {
        status: "completed",
        completedAt: new Date(),
        completedById: user.id,
      },
    });
    return { request, success: true };
  });

export const rejectClearanceRequestAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.clearance.update({
      where: { id: parsedInput.id },
      data: {
        status: "rejected",
        rejectedAt: new Date(),
        rejectedById: user.id,
      },
    });
    return { request, success: true };
  });
