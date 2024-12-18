"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { unitSchema } from "@/schemas/unitSchemas"; // Updated to import unitSchema
import { z } from "zod";

export const getUnitsAction = actionClient
  .schema(
    z.object({ skip: z.number().optional(), limit: z.number().optional() })
  )
  .action(async ({ parsedInput }) => {
    const units = await prisma.unit.findMany({
      orderBy: { updatedAt: "desc" },
      skip: parsedInput.skip,
      take: parsedInput.limit,
    });
    const totalUnits = await prisma.unit.count();
    return { units, totalUnits, success: true };
  });

export const getUnitByIdAction = actionClient
  .schema(
    z.object({
      id: z.string(),
      skip: z.number().optional(),
      limit: z.number().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const unit = await prisma.unit.findUnique({
      where: { id: parsedInput.id },
    });
    return { unit, success: true };
  });

export const createUnitAction = actionClient
  .schema(unitSchema.omit({ id: true }))
  .action(async ({ parsedInput }) => {
    const unit = await prisma.unit.create({ data: parsedInput });
    return { unit, success: true };
  });

export const updateUnitAction = actionClient
  .schema(unitSchema)
  .action(async ({ parsedInput }) => {
    const unit = await prisma.unit.update({
      where: { id: parsedInput.id },
      data: parsedInput,
    });
    return { unit, success: true };
  });
