import z from "zod";

export const registrationSchema = z.object({
  participationType: z.enum(['solo', 'team'], {
    required_error: "Participation type is required",
    invalid_type_error: "Participation type must be either 'solo' or 'team'"
  }),
  teamId: z.string().uuid().optional()
}).refine((data) => {
  // If participation type is team, teamId is required
  if (data.participationType === 'team') {
    return data.teamId !== undefined && data.teamId !== null;
  }
  return true;
}, {
  message: "Team ID is required when participation type is 'team'",
  path: ["teamId"]
});

export const getRegistrationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  participationType: z.enum(['solo', 'team']).optional()
});
