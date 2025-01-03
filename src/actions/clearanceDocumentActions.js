"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

export const getClearanceDocumentsAction = actionClient
  .schema(
    z.object({
      skip: z.number().optional(),
      limit: z.number().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const clearanceDocuments = await prisma.clearanceDocument.findMany({
      skip: parsedInput.skip,
      take: parsedInput.limit,
    });

    const totalClearanceDocuments = await prisma.clearanceDocument.count();

    return { clearanceDocuments, totalClearanceDocuments, success: true };
  });

export const getClearanceDocumentByIdAction = actionClient
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const clearanceDocument = await prisma.clearanceDocument.findUnique({
      where: { id: parsedInput.id },
    });
    return { clearanceDocument, success: true };
  });

export const createClearanceDocumentAction = actionClient
  .schema(
    z.object({
      name: z.string().min(1, { message: "Document name is required" }),
      clearanceId: z.string().min(1, { message: "Clearance ID is required" }),
      documentUrl: z.string().min(1, { message: "Document URL is required" }),
    })
  )
  .action(async ({ parsedInput: { name, documentUrl, clearanceId } }) => {
    const clearanceDocument = await prisma.clearanceDocument.create({
      data: {
        name,
        documentUrl,
        clearanceId,
      },
    });

    return { clearanceDocument, success: true };
  });

export const updateClearanceDocumentAction = actionClient
  .schema(
    z.object({
      id: z.string(),
      name: z.string().min(1, { message: "Document name is required" }),
      documentUrl: z.string().min(1, { message: "Document URL is required" }),
    })
  )
  .action(async ({ parsedInput: { id, name, documentUrl, remarks } }) => {
    const clearanceDocument = await prisma.clearanceDocument.update({
      where: { id },
      data: {
        name,
        documentUrl,
        remarks,
      },
    });
    return { clearanceDocument, success: true };
  });

export const deleteClearanceDocumentAction = actionClient
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const clearanceDocument = await prisma.clearanceDocument.delete({
      where: { id: parsedInput.id },
    });
    return { clearanceDocument, success: true };
  });
