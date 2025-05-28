import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  hackathonId: z.string().uuid(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});
