import { z } from "zod";

export const requestSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string().min(2, "Title must be at least 2 characters long"),
  activityId: z.string(),
  remarks: z.string().optional(),
});
