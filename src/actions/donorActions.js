"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { donorSchema } from "@/schemas/donorSchemas";
import { z } from "zod";

export const getDonorsAction = actionClient
  .schema(
    z.object({ skip: z.number().optional(), limit: z.number().optional() })
  )
  .action(async ({ parsedInput }) => {
    const donors = await prisma.donor.findMany({
      orderBy: { updatedAt: "desc" },
      skip: parsedInput.skip,
      take: parsedInput.limit,
    });
    const totalDonors = await prisma.donor.count();
    return { donors, totalDonors, success: true };
  });

export const createDonorAction = actionClient
  .schema(donorSchema.omit({ id: true }))
  .action(async ({ parsedInput }) => {
    const donor = await prisma.donor.create({ data: parsedInput });

    return { donor, success: true };
  });

export const updateDonorAction = actionClient
  .schema(donorSchema)
  .action(async ({ parsedInput }) => {
    const donor = await prisma.donor.update({
      where: { id: parsedInput.id },
      data: parsedInput,
    });
    return { donor, success: true };
  });
