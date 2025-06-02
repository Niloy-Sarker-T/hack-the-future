import { z } from "zod";

export const updateUserProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  bio: z
    .string()
    .trim()
    .max(200, "Bio must be less than 200 characters")
    .optional(),
  userName: z
    .string()
    .trim()
    .min(4, "Username is required")
    .max(20, "Username must be less than 20 characters")
    .optional(),
  socialLinks: z
    .object({
      website: z.string().url("Invalid URL").optional(),
      twitter: z.string().url("Invalid URL").optional(),
      github: z.string().url("Invalid URL").optional(),
      linkedin: z.string().url("Invalid URL").optional(),
    })
    .optional(),
  interests: z
    .array(z.string().trim().min(1, "Interest cannot be empty"))
    .max(5, "You can add up to 5 interests")
    .optional(),
  location: z
    .string()
    .trim()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  skills: z
    .array(z.string().trim().min(1, "Skill cannot be empty"))
    .max(10, "You can add up to 10 skills")
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

export const updateUserRoleSchema = z.object({
  role: z.enum(["users", "organizer"]),
});
