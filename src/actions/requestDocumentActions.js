"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

export const getRequestDocumentsAction = actionClient
  .schema(
    z.object({
      skip: z.number().optional(),
      limit: z.number().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const requestDocuments = await prisma.requestDocument.findMany({
      skip: parsedInput.skip,
      take: parsedInput.limit,
    });

    const totalRequestDocuments = await prisma.requestDocument.count();

    return { requestDocuments, totalRequestDocuments, success: true };
  });

export const getRequestDocumentByIdAction = actionClient
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const requestDocument = await prisma.requestDocument.findUnique({
      where: { id: parsedInput.id },
    });
    return { requestDocument, success: true };
  });

export const createRequestDocumentAction = actionClient
  .schema(
    z.object({
      name: z.string().min(1, { message: "Document name is required" }),
      requestId: z.string().min(1, { message: "Request ID is required" }),
      documentUrl: z.string().min(1, { message: "Document URL is required" }),
    })
  )
  .action(async ({ parsedInput: { name, documentUrl, requestId } }) => {
    const requestDocument = await prisma.requestDocument.create({
      data: {
        name,
        documentUrl,
        requestId,
      },
    });

    return { requestDocument, success: true };
  });

export const updateRequestDocumentAction = actionClient
  .schema(
    z.object({
      id: z.string(),
      name: z.string().min(1, { message: "Document name is required" }),
      documentUrl: z.string().min(1, { message: "Document URL is required" }),
    })
  )
  .action(async ({ parsedInput: { id, name, documentUrl } }) => {
    const requestDocument = await prisma.requestDocument.update({
      where: { id },
      data: {
        name,
        documentUrl,
      },
    });
    return { requestDocument, success: true };
  });

export const deleteRequestDocumentAction = actionClient
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const requestDocument = await prisma.requestDocument.delete({
      where: { id: parsedInput.id },
    });
    return { requestDocument, success: true };
  });
