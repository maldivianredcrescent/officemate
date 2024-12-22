"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const getClearancesAction = actionClient
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

export const getClearanceByIdAction = actionClient
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const clearance = await prisma.clearance.findUnique({
      where: { id: parsedInput.id },
      include: {
        request: {
          include: {
            activity: {
              include: {
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
            completedBy: true,
          },
        },
        submittedBy: true,
        budgetApprovedBy: true,
        financeApprovedBy: true,
        completedBy: true,
      },
    });

    const totalAmount = clearance.request.requestItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const totalExpenditure = clearance.request.requestItems.reduce(
      (sum, item) => sum + item.expenditure,
      0
    );

    return { clearance, totalAmount, totalExpenditure, success: true };
  });

export const createClearanceAction = actionClient
  .schema(z.object({ remarks: z.string().optional() }))
  .action(async ({ parsedInput }) => {
    const clearance = await prisma.clearance.create({
      data: {
        remarks: parsedInput.remarks,
      },
    });
    return { clearance, success: true };
  });

export const updateClearanceAction = actionClient
  .schema(
    z.object({
      id: z.string(),
      remarks: z.string().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const clearance = await prisma.clearance.update({
      where: { id: parsedInput.id },
      data: {
        remarks: parsedInput.remarks,
      },
    });
    return { clearance, success: true };
  });

export const submitClearanceForApprovalAction = actionClient
  .schema(z.object({ id: z.string(), signature: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const clearance = await prisma.clearance.update({
      where: { id: parsedInput.id },
      data: {
        status: "submitted",
        submittedAt: new Date(),
        submittedById: user.id,
        submittedSignature: parsedInput.signature,
      },
    });
    return { clearance, success: true };
  });

export const submitClearanceForBudgetApprovalAction = actionClient
  .schema(z.object({ id: z.string(), signature: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.clearance.update({
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

export const submitClearanceForFinanceApprovalAction = actionClient
  .schema(z.object({ id: z.string(), signature: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const clearance = await prisma.clearance.update({
      where: { id: parsedInput.id },
      data: {
        status: "finance_approved",
        financeApprovedAt: new Date(),
        financeApprovedById: user.id,
        financeApprovedSignature: parsedInput.signature,
      },
    });
    return { clearance, success: true };
  });

export const completeClearanceAction = actionClient
  .schema(z.object({ id: z.string(), signature: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const clearance = await prisma.clearance.update({
      where: { id: parsedInput.id },
      data: {
        status: "completed",
        completedAt: new Date(),
        completedById: user.id,
        completedSignature: parsedInput.signature,
      },
    });
    return { clearance, success: true };
  });

export const rejectClearanceAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const clearance = await prisma.clearance.update({
      where: { id: parsedInput.id },
      data: {
        status: "rejected",
        rejectedAt: new Date(),
        rejectedById: user.id,
      },
    });
    return { clearance, success: true };
  });
