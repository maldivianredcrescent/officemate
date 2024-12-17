import { z } from "zod";

export const requestSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  activityId: z.string(),
});
