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
        orderBy: { createdAt: "desc" },
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
        orderBy: { createdAt: "desc" },
      });

      const totalRequests = await prisma.request.count({
        where: parsedInput.type
          ? { type: parsedInput.type, unitId: user.unitId }
          : { unitId: user.unitId },
      });
      const activities = await prisma.activity.findMany({
        include: { workplan: true },
      });
      return { requests, totalRequests, activities, success: true };
    }
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
        requestDocuments: true,
        unit: true,
        requestItems: true,
        submittedBy: true,
        budgetApprovedBy: true,
        financeApprovedBy: true,
        paymentProcessedBy: true,
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

    const requestItemCount = await prisma.requestItem.count({
      where: { requestId: parsedInput.id },
    });

    if (requestItemCount === 0) {
      return {
        request,
        success: false,
        error:
          "No request items found. Please add one or more items to proceed.",
      };
    }

    const request = await prisma.request.update({
      where: { id: parsedInput.id },
      data: {
        status: "submitted",
        submittedAt: new Date(),
        submittedById: user.id,
        submittedDesignation: user.designation,
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
        budgetApprovedDesignation: user.designation,
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
        financeApprovedDesignation: user.designation,
        financeApprovedSignature: parsedInput.signature,
      },
    });
    return { request, success: true };
  });

export const submitRequestForPaymentProcessingAction = actionClient
  .schema(z.object({ id: z.string(), signature: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.request.update({
      where: { id: parsedInput.id },
      data: {
        status: "payment_processing",
        paymentProcessedAt: new Date(),
        paymentProcessedById: user.id,
        paymentProcessedDesignation: user.designation,
        paymentProcessedSignature: parsedInput.signature,
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
          submittedDesignation: user.designation,
          submittedAt: new Date(),
        },
      });
    }

    return { request, success: true };
  });

export const rejectRequestAction = actionClient
  .schema(z.object({ id: z.string(), rejectedRemarks: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;

    const request = await prisma.request.update({
      where: { id: parsedInput.id },
      data: {
        status: "rejected",
        rejectedAt: new Date(),
        rejectedById: user.id,
        rejectedRemarks: parsedInput.rejectedRemarks,
      },
    });
    return { request, success: true };
  });

export const getRequestsForExportAction = async (workplanId) => {
  const requests = await prisma.request.findMany({
    where: { activity: { workplanId: workplanId } },
    include: {
      requestItems: true,
      activity: {
        include: {
          project: {
            include: {
              donor: true,
            },
          },
        },
      },
      unit: true,
      createdBy: true,
      submittedBy: true,
      budgetApprovedBy: true,
      financeApprovedBy: true,
      paymentProcessedBy: true,
      completedBy: true,
    },
  });
  return requests;
};
