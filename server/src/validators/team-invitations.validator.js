import z from "zod";
export const inviteUserSchema = z.object({
  email: z.string().email(),
  message: z.string().max(500).optional(),
});
