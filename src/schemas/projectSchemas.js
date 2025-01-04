import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  start_year: z.number().int().min(1900, "Start year must be a valid year"),
  end_year: z.number().int().optional(),
  donorId: z.string().cuid().optional(),
  strategicCode: z.number().optional(),
  amount: z.number().optional(),
  file: z.string().optional(),
  userId: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});
