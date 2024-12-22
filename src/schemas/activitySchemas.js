import { z } from "zod";

export const activitySchema = z.object({
  id: z.string().optional(),
  code: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  budget: z.number().optional(),
  workplanId: z.string().optional(),
  projectId: z.string().optional(),
});
