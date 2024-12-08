"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { projectSchema } from "@/schemas/projectSchemas"; // Updated import to projectSchema
import { z } from "zod";

export const getProjectsAction = actionClient // Updated function name
  .schema(
    z.object({ skip: z.number().optional(), limit: z.number().optional() })
  )
  .action(async ({ parsedInput }) => {
    const projects = await prisma.project.findMany({
      // Updated to use project model
      orderBy: { updatedAt: "desc" },
      skip: parsedInput.skip,
      take: parsedInput.limit,
      include: { donor: true },
    });
    const donors = await prisma.donor.findMany();
    const totalProjects = await prisma.project.count(); // Updated to count projects
    return { projects, donors, totalProjects, success: true }; // Updated return object
  });

export const getProjectByIdAction = actionClient // Updated function name
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const project = await prisma.project.findUnique({
      where: { id: parsedInput.id },
    });
    const donors = await prisma.donor.findMany();
    return { project, donors, success: true };
  });

export const createProjectAction = actionClient // Updated function name
  .schema(projectSchema.omit({ id: true })) // Updated to use projectSchema
  .action(async ({ parsedInput }) => {
    const project = await prisma.project.create({ data: parsedInput }); // Updated to create project

    return { project, success: true }; // Updated return object
  });

export const updateProjectAction = actionClient // Updated function name
  .schema(projectSchema) // Updated to use projectSchema
  .action(async ({ parsedInput }) => {
    const project = await prisma.project.update({
      // Updated to update project
      where: { id: parsedInput.id },
      data: parsedInput,
    });
    return { project, success: true }; // Updated return object
  });
