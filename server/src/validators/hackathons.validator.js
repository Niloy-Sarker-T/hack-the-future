import { z } from "zod";

const INTEREST_OPTIONS = [
  "Beginner Friendly",
  "Machine Learning/AI",
  "Web",
  "Blockchain",
  "Mobile",
  "Health",
  "Education",
  "Gaming",
  "Fintech",
  "IoT",
  "Cybersecurity",
  "DevOps",
  "Productivity",
  "Design",
  "AR/VR",
  "Social Good",
];

export const createHackathonSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).optional(),
  requirements: z.string().trim().min(1).optional(),
  judgingCriteria: z.string().trim().min(1).optional(),
  maxTeamSize: z.number().int().positive().optional(),
  minTeamSize: z.number().int().positive().min(1).optional(),
  allowSoloParticipation: z.boolean().optional(),
  organizeBy: z.string().trim().min(1).max(200).optional(),
  registrationDeadline: z.string().datetime().optional(),
  submissionDeadline: z.string().datetime().optional(),
  themes: z.array(z.enum(INTEREST_OPTIONS)).min(2).max(5).optional(),
  thumbnail: z.string().trim().optional(),
  banner: z.string().trim().optional(),
  status: z.enum(["draft", "upcoming", "ongoing", "completed"]).optional(),
});

export const updateHackathonSchema = createHackathonSchema.partial();

export const joinHackathonSchema = z.object({
  participationType: z.enum(["solo", "team"]),
  teamId: z.string().trim().optional(),
});
