"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { donorSchema } from "@/schemas/donorSchemas";

export const getDonorsAction = actionClient.action(async () => {
  const donors = await prisma.donor.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return { donors, success: true };
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
