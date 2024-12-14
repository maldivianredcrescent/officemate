"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { activitySchema } from "@/schemas/activitySchemas"; // Assuming you have an activity schema
import { z } from "zod";

export const getActivitiesAction = actionClient
  .schema(
    z.object({ skip: z.number().optional(), limit: z.number().optional() })
  )
  .action(async ({ parsedInput }) => {
    const activities = await prisma.activity.findMany({
      orderBy: { updatedAt: "desc" },
      skip: parsedInput.skip,
      take: parsedInput.limit,
    });
    const totalActivities = await prisma.activity.count();
    return { activities, totalActivities, success: true };
  });

export const getActivityByIdAction = actionClient
  .schema(
    z.object({
      id: z.string(),
      skip: z.number().optional(),
      limit: z.number().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const activity = await prisma.activity.findUnique({
      where: { id: parsedInput.id },
    });
    const relatedProjects = await prisma.project.findMany({
      where: { activityId: parsedInput.id }, // Assuming a relationship with activity
      skip: parsedInput.skip,
      take: parsedInput.limit,
    });
    return { activity, relatedProjects, success: true };
  });

export const createActivityAction = actionClient
  .schema(activitySchema.omit({ id: true })) // Assuming you have an activity schema
  .action(async ({ parsedInput }) => {
    const activity = await prisma.activity.create({ data: parsedInput });
    return { activity, success: true };
  });

export const updateActivityAction = actionClient
  .schema(activitySchema) // Assuming you have an activity schema
  .action(async ({ parsedInput }) => {
    const activity = await prisma.activity.update({
      where: { id: parsedInput.id },
      data: parsedInput,
    });
    return { activity, success: true };
  });
