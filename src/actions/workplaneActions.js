"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { workPlanSchema } from "@/schemas/workPlanSchemas";
import { z } from "zod";

export const getWorkplansAction = actionClient.action(async () => {
  const workplans = await prisma.workplan.findMany();
  return { workplans, success: true };
});

export const getWorkplanByIdAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const workplan = await prisma.workplan.findUnique({
      where: { id: parsedInput.id }, // Ensuring the id is explicitly referenced
    });

    const activities = await prisma.activity.findMany({
      where: {
        workplanId: parsedInput.id,
      },
      include: {
        project: true,
      },
    });

    const totalActivities = await prisma.activity.count({
      where: {
        workplanId: parsedInput.id,
      },
    });

    const availableBudget = activities.reduce(
      (total, activity) => total + activity.budget,
      0
    );

    const allProjects = await prisma.project.findMany();

    return {
      workplan,
      activities,
      allProjects,
      totalActivities,
      success: true,
      availableBudget,
    };
  });

export const createWorkplanAction = actionClient
  .schema(workPlanSchema.omit({ id: true }))
  .action(async ({ parsedInput }) => {
    const workplan = await prisma.workplan.create({ data: parsedInput });

    return { workplan, success: true };
  });

export const updateWorkplanAction = actionClient
  .schema(workPlanSchema)
  .action(async ({ parsedInput }) => {
    const workplan = await prisma.workplan.update({
      where: { id: parsedInput.id },
      data: parsedInput,
    });
    return { workplan, success: true };
  });