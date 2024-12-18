import { z } from "zod";

export const unitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
});
