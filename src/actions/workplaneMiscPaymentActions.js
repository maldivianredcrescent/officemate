"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { workplanMiscPaymentSchema } from "@/schemas/workplanMiscPaymentSchema"; // Updated schema import
import { z } from "zod";

export const getWorkplanMiscPaymentsAction = actionClient.action(async () => {
  const workplanMiscPayments = await prisma.workplanMiscPayment.findMany();
  return { workplanMiscPayments, success: true };
});

export const getWorkplanMiscPaymentByIdAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const workplanMiscPayment = await prisma.workplanMiscPayment.findUnique({
      where: { id: parsedInput.id },
    });

    return {
      workplanMiscPayment,
      success: true,
    };
  });

export const createWorkplanMiscPaymentAction = actionClient
  .schema(workplanMiscPaymentSchema.omit({ id: true })) // Updated schema usage
  .action(async ({ parsedInput }) => {
    const workplanMiscPayment = await prisma.workplanMiscPayment.create({
      data: parsedInput,
    });

    return { workplanMiscPayment, success: true };
  });

export const updateWorkplanMiscPaymentAction = actionClient
  .schema(workplanMiscPaymentSchema) // Updated schema usage
  .action(async ({ parsedInput }) => {
    const workplanMiscPayment = await prisma.workplanMiscPayment.update({
      where: { id: parsedInput.id },
      data: parsedInput,
    });
    return { workplanMiscPayment, success: true };
  });

export const deleteWorkplanMiscPaymentAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    await prisma.workplanMiscPayment.delete({
      where: { id: parsedInput.id },
    });
    return { success: true };
  });
