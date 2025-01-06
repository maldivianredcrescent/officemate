import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  password: z.string().optional(),
  unitId: z.string().optional(),
  role: z.string().optional(),
  designation: z.string().optional(),
});
