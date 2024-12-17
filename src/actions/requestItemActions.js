"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { requestItemSchema } from "@/schemas/requestItemSchemas"; // Updated import to requestItemSchema
import { z } from "zod";

export const getRequestItemsAction = actionClient
  .schema(
    z.object({
      requestId: z.string(),
      skip: z.number().optional(),
      limit: z.number().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const requestItems = await prisma.requestItem.findMany({
      where: { requestId: parsedInput.requestId },
      skip: parsedInput.skip,
      take: parsedInput.limit,
    });

    const totalRequestItems = await prisma.requestItem.count({
      where: { requestId: parsedInput.requestId },
    });

    return { requestItems, totalRequestItems, success: true };
  });

export const getRequestItemByIdAction = actionClient
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const requestItem = await prisma.requestItem.findUnique({
      where: { id: parsedInput.id },
    });
    return { requestItem, success: true };
  });

export const createRequestItemAction = actionClient
  .schema(requestItemSchema.omit({ id: true }))
  .action(async ({ parsedInput: { requestId, name, qty, rate } }) => {
    const requestItem = await prisma.requestItem.create({
      data: {
        requestId,
        name,
        qty: qty,
        rate: rate,
        amount: qty * rate,
      },
    });

    return { requestItem, success: true };
  });

export const updateRequestItemAction = actionClient
  .schema(requestItemSchema)
  .action(async ({ parsedInput: { id, name, qty, rate } }) => {
    const requestItem = await prisma.requestItem.update({
      where: { id },
      data: {
        name,
        qty: qty,
        rate: rate,
        amount: qty * rate,
      },
    });
    return { requestItem, success: true };
  });

export const deleteRequestItemAction = actionClient
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    console.log(parsedInput);
    const requestItem = await prisma.requestItem.delete({
      where: { id: parsedInput.id },
    });
    return { requestItem, success: true };
  });
