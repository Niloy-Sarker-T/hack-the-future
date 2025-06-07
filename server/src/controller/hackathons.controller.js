import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { db } from "../db/db.config.js";
import {
  hackathonsTable,
  hackathonParticipants,
  //   teamsTable,
} from "../db/schema/index.js";
import { eq, and, gte, or, count } from "drizzle-orm";
import upload from "../middleware/multer.middleware.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";
import { sql, ilike } from "drizzle-orm";

export const createHackathon = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    judgingCriteria,
    maxTeamSize,
    minTeamSize,
    allowSoloParticipation,
    organizeBy,
    registrationDeadline,
    submissionDeadline,
    themes,
    status,
  } = req.body;
  const createdBy = req.user.id;

  const [hackathon] = await db
    .insert(hackathonsTable)
    .values({
      title,
      description,
      requirements,
      judgingCriteria,
      maxTeamSize,
      minTeamSize,
      allowSoloParticipation,
      organizeBy,
      createdBy,
      registrationDeadline: registrationDeadline
        ? new Date(registrationDeadline)
        : null,
      submissionDeadline: submissionDeadline
        ? new Date(submissionDeadline)
        : null,
      themes, // JSONB array
      status,
    })
    .returning();

  return res
    .status(201)
    .json(
      new ApiResponse(201, { ...hackathon }, "Hackathon created successfully")
    );
});

export const getAllHackathons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  let { themes } = req.query; // themes[] from query

  const offset = (page - 1) * limit;

  // Normalize themes[] from query (?themes[]=A&themes[]=B)
  if (themes) {
    if (typeof themes === "string") {
      themes = [themes];
    }
    // decode URI components (in case of spaces, slashes, etc.)
    themes = themes.map((t) => decodeURIComponent(t));
  }

  let query = db
    .select({
      id: hackathonsTable.id,
      title: hackathonsTable.title,
      themes: hackathonsTable.themes,
      organizeBy: hackathonsTable.organizeBy,
      createdAt: hackathonsTable.createdAt,
      updatedAt: hackathonsTable.updatedAt,
      registrationDeadline: hackathonsTable.registrationDeadline,
      submissionDeadline: hackathonsTable.submissionDeadline,
      status: hackathonsTable.status,
      allowSoloParticipation: hackathonsTable.allowSoloParticipation,
      createdBy: hackathonsTable.createdBy,
      thumbnail: hackathonsTable.thumbnail,
    })
    .from(hackathonsTable);

  if (status) {
    query = query.where(eq(hackathonsTable.status, status));
  }
  if (search) {
    query = query.where(ilike(hackathonsTable.title, `%${search}%`));
  }
  // Handle themes[] as array for PostgreSQL ARRAY column
  if (themes && Array.isArray(themes) && themes.length > 0) {
    // Use raw SQL for overlaps operator (PostgreSQL)
    query = query.where(sql`${hackathonsTable.themes} && ${themes}`);
  }

  const hackathons = await query
    .limit(Number(limit))
    .offset(Number(offset))
    .orderBy(hackathonsTable.updatedAt, "desc");

  if (hackathons.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], "No hackathons found"));
  }

  // Add total count for pagination
  const totalCount = await db
    .select({ count: count(hackathonsTable.id) })
    .from(hackathonsTable)
    .where(
      and(
        status ? eq(hackathonsTable.status, status) : true,
        search ? ilike(hackathonsTable.title, `%${search}%`) : true,
        themes && themes.length > 0
          ? sql`${hackathonsTable.themes} && ${themes}`
          : true
      )
    );
  const total = totalCount[0]?.count ?? 0;
  const response = {
    hackathons,
    total,
    page: Number(page),
    limit: Number(limit),
  };
  return res
    .status(200)
    .json(
      new ApiResponse(200, { ...response }, "Hackathons fetched successfully")
    );
});

export const joinHackathon = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const { participationType, teamId } = req.body;
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

  // Fetch hackathon details
  const hackathon = await db
    .select()
    .from(hackathonsTable)
    .where(eq(hackathonsTable.id, hackathonId))
    .limit(1);

  if (!hackathon.length) throw new ApiError(404, "Hackathon not found");

  // Registration deadline check
  if (
    hackathon[0].registrationDeadline &&
    new Date() > new Date(hackathon[0].registrationDeadline)
  ) {
    throw new ApiError(400, "Registration deadline has passed");
  }

  // Status check
  if (hackathon[0].status !== "upcoming") {
    throw new ApiError(400, "Registration is closed for this hackathon");
  }

  // Max participants check (if you have maxParticipants field)
  if (hackathon[0].maxParticipants) {
    const participantCount = await db
      .select()
      .from(hackathonParticipants)
      .where(eq(hackathonParticipants.hackathonId, hackathonId));
    if (participantCount.length >= hackathon[0].maxParticipants) {
      throw new ApiError(400, "Hackathon is full");
    }
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

  return res
    .status(201)
    .json(
      new ApiResponse(201, { ...participant }, "Successfully joined hackathon")
    );
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

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...hackathon[0] },
        "Hackathon fetched successfully"
      )
    );
});

export const getHackathonParticipants = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const participants = await db
    .select({
      userId: hackathonParticipants.userId,
      participationType: hackathonParticipants.participationType,
      teamId: hackathonParticipants.teamId,
    })
    .from(hackathonParticipants)
    .where(eq(hackathonParticipants.hackathonId, hackathonId))
    .limit(Number(limit))
    .offset(Number(offset));

  if (participants.length === 0) {
    throw new ApiError(404, "No participants found for this hackathon");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...participants },
        "Participants fetched successfully"
      )
    );
});

export const updateHackathon = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const userId = req.user.id;
  const updateData = req.body;
  const { themes } = req.body;

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

  // Restrict updates after registration deadline
  if (
    hackathon[0].registrationDeadline &&
    new Date() > new Date(hackathon[0].registrationDeadline)
  ) {
    throw new ApiError(
      400,
      "Cannot update hackathon after registration deadline"
    );
  }

  if (updateData.registrationDeadline) {
    updateData.registrationDeadline = new Date(updateData.registrationDeadline);
  }
  if (updateData.submissionDeadline) {
    updateData.submissionDeadline = new Date(updateData.submissionDeadline);
  }
  // Optionally: Validate fields here (e.g., don't allow past deadlines)

  const [updatedHackathon] = await db
    .update(hackathonsTable)
    .set({
      ...updateData,
      updatedAt: new Date(),
      themes, // should be an array of strings
    })
    .where(eq(hackathonsTable.id, hackathonId))
    .returning();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...updatedHackathon },
        "Hackathon updated successfully"
      )
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

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Hackathon deleted successfully"));
});

// Get upcoming 10 hackathons
export const getUpcomingHackathons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const upcomingHackathons = await db
    .select()
    .from(hackathonsTable)
    .where(
      and(
        eq(hackathonsTable.status, "upcoming"),
        gte(hackathonsTable.registrationDeadline, new Date())
      )
    )
    .orderBy(hackathonsTable.registrationDeadline, "asc")
    .limit(Number(limit))
    .offset(Number(offset));

  if (upcomingHackathons.length === 0) {
    throw new ApiError(404, "No upcoming hackathons found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...upcomingHackathons },
        "Upcoming hackathons fetched"
      )
    );
});

// Get ended hackathons (status: "ended" or submissionDeadline in the past)
export const getEndHackathons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const endedHackathons = await db
    .select()
    .from(hackathonsTable)
    .where(
      or(
        eq(hackathonsTable.status, "ended"),
        and(
          hackathonsTable.submissionDeadline.isNotNull(),
          gte(new Date(), hackathonsTable.submissionDeadline)
        )
      )
    )
    .orderBy(hackathonsTable.submissionDeadline, "desc")
    .limit(Number(limit))
    .offset(Number(offset));

  if (endedHackathons.length === 0) {
    throw new ApiError(404, "No ended hackathons found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { ...endedHackathons }, "Ended hackathons fetched")
    );
});

// Get ongoing hackathons (status: "ongoing" or current date between registrationDeadline and submissionDeadline)
export const getOngoingHackathons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const now = new Date();

  const ongoingHackathons = await db
    .select()
    .from(hackathonsTable)
    .where(
      or(
        eq(hackathonsTable.status, "ongoing"),
        and(
          hackathonsTable.registrationDeadline.isNotNull(),
          hackathonsTable.submissionDeadline.isNotNull(),
          gte(now, hackathonsTable.registrationDeadline),
          gte(hackathonsTable.submissionDeadline, now)
        )
      )
    )
    .orderBy(hackathonsTable.registrationDeadline, "asc")
    .limit(Number(limit))
    .offset(Number(offset));

  if (ongoingHackathons.length === 0) {
    throw new ApiError(404, "No ongoing hackathons found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...ongoingHackathons },
        "Ongoing hackathons fetched"
      )
    );
});

// Controller for uploading thumbnail or banner image
export const uploadHackathonImage = asyncHandler(async (req, res) => {
  // Verifiy hackathonId in params exists for any hackathon
  const { hackathonId } = req.params;
  if (!hackathonId) {
    throw new ApiError(400, "Hackathon ID is required");
  }

  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }
  // Check if user is authorized to upload (must be creator)
  const hackathon = await db
    .select()
    .from(hackathonsTable)
    .where(eq(hackathonsTable.id, hackathonId))
    .limit(1);
  if (hackathon.length === 0) {
    throw new ApiError(404, "Hackathon not found");
  }
  if (hackathon[0].createdBy !== req.user.id) {
    throw new ApiError(
      403,
      "You are not authorized to upload images for this hackathon"
    );
  }

  if (!req.file || !["thumbnail", "banner"].includes(req.body.type)) {
    throw new ApiError(
      400,
      'Invalid upload: image file is required and type must be either "thumbnail" or "banner"'
    );
  }

  let result;
  try {
    result = await uploadBufferToCloudinary(req.file.buffer, "hackathons", {
      public_id: `hackathon-${hackathonId}`,
      folder: "hackathons",
      resource_type: "image",
      overwrite: true,
    });
  } catch (error) {
    throw new ApiError(
      500,
      "Internal server error while processing image upload"
    );
  }

  if (!result || !result.secure_url) {
    throw new ApiError(500, "Image upload failed");
  }
  // Update hackathon with the image URL
  await db
    .update(hackathonsTable)
    .set({
      [req.body.type]: result.secure_url,
      updatedAt: new Date(),
    })
    .where(eq(hackathonsTable.id, hackathonId));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { url: result.secure_url, type: req.body.type },
        "Image uploaded"
      )
    );
});
