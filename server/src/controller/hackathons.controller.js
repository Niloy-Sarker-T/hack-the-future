import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { db } from "../db/db.config.js";
import {
  hackathonsTable,
  hackathonParticipants,
  //   teamsTable,
} from "../db/schema/index.js";
import { eq, and } from "drizzle-orm";

export const createHackathon = asyncHandler(async (req, res) => {
  const { title, description, theme, maxTeamSize, minTeamSize, organizeBy } =
    req.body;
  const createdBy = req.user.id;

  const [hackathon] = await db
    .insert(hackathonsTable)
    .values({
      title,
      description,
      theme,
      maxTeamSize,
      minTeamSize,
      organizeBy,
      createdBy,
    })
    .returning();

  res
    .status(201)
    .json(new ApiResponse(201, hackathon, "Hackathon created successfully"));
});

export const getAllHackathons = asyncHandler(async (req, res) => {
  const hackathons = await db.select().from(hackathonsTable);
  res
    .status(200)
    .json(new ApiResponse(200, hackathons, "Hackathons fetched successfully"));
});

export const joinHackathon = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const { participationType, teamId } = req.body; // 'solo' or 'team'
  const userId = req.user.id;

  // Check if already registered
  const existing = await db
    .select()
    .from(hackathonParticipants)
    .where(
      and(
        eq(hackathonParticipants.hackathonId, hackathonId),
        eq(hackathonParticipants.userId, userId)
      )
    );

  if (existing.length > 0) {
    throw new ApiError(409, "Already registered for this hackathon");
  }

  const [participant] = await db
    .insert(hackathonParticipants)
    .values({
      hackathonId,
      userId,
      participationType,
      teamId: participationType === "team" ? teamId : null,
    })
    .returning();

  res
    .status(201)
    .json(new ApiResponse(201, participant, "Successfully joined hackathon"));
});

export const getHackathonById = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;

  const hackathon = await db
    .select()
    .from(hackathonsTable)
    .where(eq(hackathonsTable.id, hackathonId))
    .limit(1);

  if (hackathon.length === 0) {
    throw new ApiError(404, "Hackathon not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, hackathon[0], "Hackathon fetched successfully"));
});

export const getHackathonParticipants = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;

  const participants = await db
    .select({
      userId: hackathonParticipants.userId,
      participationType: hackathonParticipants.participationType,
      teamId: hackathonParticipants.teamId,
    })
    .from(hackathonParticipants)
    .where(eq(hackathonParticipants.hackathonId, hackathonId));

  if (participants.length === 0) {
    throw new ApiError(404, "No participants found for this hackathon");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, participants, "Participants fetched successfully")
    );
});

export const updateHackathon = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const userId = req.user.id;
  const updateData = req.body;

  // First check if hackathon exists
  const hackathon = await db
    .select()
    .from(hackathonsTable)
    .where(eq(hackathonsTable.id, hackathonId))
    .limit(1);

  if (hackathon.length === 0) {
    throw new ApiError(404, "Hackathon not found");
  }

  // Check if user is authorized to update (must be creator)
  if (hackathon[0].createdBy !== userId) {
    throw new ApiError(403, "You are not authorized to update this hackathon");
  }

  // Update the hackathon
  const [updatedHackathon] = await db
    .update(hackathonsTable)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(hackathonsTable.id, hackathonId))
    .returning();

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedHackathon, "Hackathon updated successfully")
    );
});

export const deleteHackathon = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const userId = req.user.id;

  // First check if hackathon exists
  const hackathon = await db
    .select()
    .from(hackathonsTable)
    .where(eq(hackathonsTable.id, hackathonId))
    .limit(1);

  if (hackathon.length === 0) {
    throw new ApiError(404, "Hackathon not found");
  }

  // Check if user is authorized to delete (must be creator)
  if (hackathon[0].createdBy !== userId) {
    throw new ApiError(403, "You are not authorized to delete this hackathon");
  }

  // Delete the hackathon (this will cascade delete participants due to foreign key)
  await db.delete(hackathonsTable).where(eq(hackathonsTable.id, hackathonId));

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Hackathon deleted successfully"));
});

// Get upcoming 5 hackathons
export const getUpcomingHackathons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  const upcomingHackathons = await db
    .select()
    .from(hackathonsTable)
    .where(eq(hackathonsTable.isActive, true))
    .orderBy(hackathonsTable.startDate, "asc")
    .limit(limit)
    .offset(offset);

  if (upcomingHackathons.length === 0) {
    throw new ApiError(404, "No upcoming hackathons found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, upcomingHackathons, "Upcoming hackathons fetched")
    );
});
