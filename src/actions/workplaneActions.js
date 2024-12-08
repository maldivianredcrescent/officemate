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

    const workplanProjects = await prisma.workplanProject.findMany({
      where: {
        workplanId: parsedInput.id,
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        id: {
          in: workplanProjects.map((wp) => wp.projectId),
        },
      },
    });

    return { workplan, projects, success: true };
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
