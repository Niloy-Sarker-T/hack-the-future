import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  demoUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  isPublic: z.boolean().default(true),
});

export const updateProjectSchema = createProjectSchema.partial();
