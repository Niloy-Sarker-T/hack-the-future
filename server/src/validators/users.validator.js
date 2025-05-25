import { z } from "zod";

export const updateUserProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  bio: z.string().max(200, "Bio must be less than 200 characters").optional(),
  userName: z
    .string()
    .min(4, "Username is required")
    .max(20, "Username must be less than 20 characters")
    .optional(),
  socialsLinks: z
    .object({
      website: z.string().url("Invalid URL").optional(),
      twitter: z.string().url("Invalid URL").optional(),
      github: z.string().url("Invalid URL").optional(),
      linkedin: z.string().url("Invalid URL").optional(),
    })
    .optional(),
});
export const uploadProfileImageSchema = z.object({
  image: z
    .instanceof(Buffer)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .optional(),
});
