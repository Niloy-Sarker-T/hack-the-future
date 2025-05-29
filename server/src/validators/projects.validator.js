import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  demoUrl: z.string().trim().url().optional(),
  videoUrl: z.string().trim().url().optional(),
  isPublic: z.boolean().default(true),
});

export const updateProjectSchema = createProjectSchema.partial();
