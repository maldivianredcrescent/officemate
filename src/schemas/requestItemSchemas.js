import { z } from "zod";

export const requestItemSchema = z.object({
  id: z.string().optional(),
  requestId: z.string().optional(),
  name: z.string(),
  qty: z.number(),
  rate: z.number(),
  remarks: z.string().optional(),
  gst: z.number().optional(),
  tgst: z.number().optional(),
  serviceCharge: z.number().optional(),
});
