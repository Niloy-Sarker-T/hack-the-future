import z from "zod";

// EXISTING SCHEMAS (keep these if you have them)
export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).optional().default([]),
  demoUrl: z.string().url("Invalid demo URL").optional().or(z.literal("")),
  videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
  isPublic: z.boolean().optional().default(true),
});

export const updateProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long")
    .optional(),
  description: z.string().min(1, "Description is required").optional(),
  tags: z.array(z.string()).optional(),
  demoUrl: z.string().url("Invalid demo URL").optional().or(z.literal("")),
  videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
  repositoryUrl: z
    .string()
    .url("Invalid repository URL")
    .optional()
    .or(z.literal("")),
  isPublic: z.boolean().optional(),
});

// ADD THIS NEW SCHEMA FOR HACKATHON PROJECTS
export const createHackathonProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).optional().default([]),
  demoUrl: z.string().url("Invalid demo URL").optional().or(z.literal("")),
  videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
  repositoryUrl: z
    .string()
    .url("Invalid repository URL")
    .optional()
    .or(z.literal("")),
  hackathonId: z.string().uuid("Invalid hackathon ID"),
  teamId: z.string().uuid("Invalid team ID").optional().nullable(),
});

// ADD QUERY VALIDATION SCHEMAS
export const getHackathonProjectsQuerySchema = z.object({
  status: z.enum(["all", "draft", "submitted", "judged"]).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});
