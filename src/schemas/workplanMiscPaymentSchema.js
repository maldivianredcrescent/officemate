import { z } from "zod";

export const workplanMiscPaymentSchema = z.object({
  id: z.string().optional(),
  workplanId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(0, "Amount must be greater than 0"),
  description: z.string().optional(),
  activityId: z.string().optional(),
});
