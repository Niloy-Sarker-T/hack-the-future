import { z } from "zod";

export const createHackathonSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  theme: z.string().optional(),
  maxTeamSize: z.number().int().positive().optional(),
  minTeamSize: z.number().int().positive().optional(),
  organizeBy: z.string().min(1).max(200),
});

export const updateHackathonSchema = createHackathonSchema.partial();

export const joinHackathonSchema = z.object({
  participationType: z.enum(["solo", "team"]),
  teamId: z.string().optional(),
});
