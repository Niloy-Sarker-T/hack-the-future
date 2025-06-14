import { z } from "zod";

export const assignJudgesSchema = z.object({
  body: z.object({
    judges: z
      .array(
        z.object({
          userId: z.string().uuid().optional(),
          externalJudgeEmail: z.string().email().optional(),
          role: z.enum(["judge", "mentor"]).default("judge"),
        })
      )
      .min(1, "At least one judge must be assigned"),
  }),
  params: z.object({
    hackathonId: z.string().uuid(),
  }),
});

export const evaluateProjectSchema = z.object({
  body: z.object({
    scores: z.record(z.number().min(0).max(10)), // Object with criteria names as keys and scores as values
    feedback: z.string().optional(),
    overallScore: z.number().min(0).max(100),
  }),
  params: z.object({
    projectId: z.string().uuid(),
  }),
});
