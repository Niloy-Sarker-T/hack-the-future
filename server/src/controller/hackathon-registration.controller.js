import { db } from "../db/db.config.js";
import {
  hackathonParticipants,
  hackathonsTable,
  teamsTable,
  teamMembersTable,
  usersTable,
} from "../db/schema/index.js";
import { eq, and, sql } from "drizzle-orm";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

export const registerForHackathon = asyncHandler(async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { participationType, teamId } = req.body;
    const userId = req.user.id;

    // Validate hackathon exists and registration is open
    const hackathon = await db
      .select()
      .from(hackathonsTable)
      .where(eq(hackathonsTable.id, hackathonId))
      .limit(1);

    if (!hackathon.length) {
      return res.status(404).json({
        success: false,
        error: "Hackathon not found",
      });
    }

    const hackathonData = hackathon[0];

    // Check registration deadline
    if (new Date() > new Date(hackathonData.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        error: "Registration deadline has passed",
      });
    }

    // Check if already registered
    const existingRegistration = await db
      .select()
      .from(hackathonParticipants)
      .where(
        and(
          eq(hackathonParticipants.hackathonId, hackathonId),
          eq(hackathonParticipants.userId, userId)
        )
      )
      .limit(1);

    if (existingRegistration.length) {
      return res.status(400).json({
        success: false,
        error: "Already registered for this hackathon",
      });
    }

    // Validate participation type
    if (participationType === "solo" && !hackathonData.allowSoloParticipation) {
      return res.status(400).json({
        success: false,
        error: "Solo participation is not allowed for this hackathon",
      });
    }

    // For team registration, validate team
    if (participationType === "team") {
      if (!teamId) {
        return res.status(400).json({
          success: false,
          error: "Team ID is required for team registration",
        });
      }

      // Verify user is team member
      const teamMembership = await db
        .select({
          role: teamMembersTable.role,
          teamName: teamsTable.teamName,
          memberCount: sql`(SELECT COUNT(*) FROM ${teamMembersTable} WHERE ${teamMembersTable.teamId} = ${teamsTable.id})`,
        })
        .from(teamMembersTable)
        .leftJoin(teamsTable, eq(teamMembersTable.teamId, teamsTable.id))
        .where(
          and(
            eq(teamMembersTable.teamId, teamId),
            eq(teamMembersTable.userId, userId)
          )
        )
        .limit(1);

      if (!teamMembership.length) {
        return res.status(400).json({
          success: false,
          error: "You are not a member of this team",
        });
      }

      const teamData = teamMembership[0];

      // Check team size constraints
      if (
        teamData.memberCount < hackathonData.minTeamSize ||
        teamData.memberCount > hackathonData.maxTeamSize
      ) {
        return res.status(400).json({
          success: false,
          error: `Team size must be between ${hackathonData.minTeamSize} and ${hackathonData.maxTeamSize} members`,
        });
      }

      // Check if team is already registered for this hackathon
      const existingTeamRegistration = await db
        .select()
        .from(hackathonParticipants)
        .where(
          and(
            eq(hackathonParticipants.hackathonId, hackathonId),
            eq(hackathonParticipants.teamId, teamId)
          )
        )
        .limit(1);

      if (existingTeamRegistration.length) {
        return res.status(400).json({
          success: false,
          error: "This team is already registered for the hackathon",
        });
      }
    }

    // Create registration
    const registration = await db
      .insert(hackathonParticipants)
      .values({
        hackathonId,
        userId,
        participationType,
        teamId: participationType === "team" ? teamId : null,
      })
      .returning();

    // Get complete registration data for response
    const completeRegistration = await db
      .select({
        id: hackathonParticipants.id,
        hackathonId: hackathonParticipants.hackathonId,
        userId: hackathonParticipants.userId,
        participationType: hackathonParticipants.participationType,
        teamId: hackathonParticipants.teamId,
        joinedAt: hackathonParticipants.joinedAt,
        hackathonTitle: hackathonsTable.title,
        teamName: teamsTable.teamName,
      })
      .from(hackathonParticipants)
      .leftJoin(
        hackathonsTable,
        eq(hackathonParticipants.hackathonId, hackathonsTable.id)
      )
      .leftJoin(teamsTable, eq(hackathonParticipants.teamId, teamsTable.id))
      .where(eq(hackathonParticipants.id, registration[0].id))
      .limit(1);

    res.status(201).json({
      success: true,
      data: completeRegistration[0],
      message: `Successfully registered for ${hackathonData.title}`,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export const getMyRegistration = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.user.id;

    const registration = await db
      .select({
        id: hackathonParticipants.id,
        participationType: hackathonParticipants.participationType,
        joinedAt: hackathonParticipants.joinedAt,
        team: {
          id: teamsTable.id,
          name: teamsTable.teamName,
          description: teamsTable.description,
          memberCount: sql`(SELECT COUNT(*) FROM ${teamMembersTable} WHERE ${teamMembersTable.teamId} = ${teamsTable.id})`,
        },
      })
      .from(hackathonParticipants)
      .leftJoin(teamsTable, eq(hackathonParticipants.teamId, teamsTable.id))
      .where(
        and(
          eq(hackathonParticipants.hackathonId, hackathonId),
          eq(hackathonParticipants.userId, userId)
        )
      )
      .limit(1);

    if (!registration.length) {
      return res.status(404).json({
        success: false,
        error: "No registration found for this hackathon",
      });
    }

    res.json(
      new ApiResponse(
        200,
        registration[0],
        "Registration details retrieved successfully"
      )
    );
  } catch (error) {
    next(
      new ApiError(
        500,
        "Failed to fetch registration details",
        error.message || "Internal server error"
      )
    );
  }
};

export const withdrawRegistration = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.user.id;

    // Check if hackathon allows withdrawal (e.g., not started yet)
    const hackathon = await db
      .select()
      .from(hackathonsTable)
      .where(eq(hackathonsTable.id, hackathonId))
      .limit(1);

    if (!hackathon.length) {
      return res.status(404).json({
        success: false,
        error: "Hackathon not found",
      });
    }

    // You might want to add logic to prevent withdrawal after hackathon starts
    const hackathonData = hackathon[0];
    if (
      hackathonData.status === "ongoing" ||
      hackathonData.status === "ended"
    ) {
      return res.status(400).json({
        success: false,
        error: "Cannot withdraw from a hackathon that has already started",
      });
    }

    const result = await db
      .delete(hackathonParticipants)
      .where(
        and(
          eq(hackathonParticipants.hackathonId, hackathonId),
          eq(hackathonParticipants.userId, userId)
        )
      )
      .returning();

    if (!result.length) {
      return res.status(404).json({
        success: false,
        error: "No registration found to withdraw",
      });
    }

    res.json({
      success: true,
      message: "Registration withdrawn successfully",
    });
  } catch (error) {
    console.error("Withdraw registration error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const updateRegistration = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { participationType, teamId } = req.body;
    const userId = req.user.id;

    // Get existing registration
    const existingRegistration = await db
      .select()
      .from(hackathonParticipants)
      .where(
        and(
          eq(hackathonParticipants.hackathonId, hackathonId),
          eq(hackathonParticipants.userId, userId)
        )
      )
      .limit(1);

    if (!existingRegistration.length) {
      return res.status(404).json({
        success: false,
        error: "No registration found to update",
      });
    }

    // Similar validation as in registration
    const hackathon = await db
      .select()
      .from(hackathonsTable)
      .where(eq(hackathonsTable.id, hackathonId))
      .limit(1);

    const hackathonData = hackathon[0];

    if (participationType === "solo" && !hackathonData.allowSoloParticipation) {
      return res.status(400).json({
        success: false,
        error: "Solo participation is not allowed for this hackathon",
      });
    }

    if (participationType === "team" && teamId) {
      // Validate team membership
      const teamMembership = await db
        .select()
        .from(teamMembersTable)
        .where(
          and(
            eq(teamMembersTable.teamId, teamId),
            eq(teamMembersTable.userId, userId)
          )
        )
        .limit(1);

      if (!teamMembership.length) {
        return res.status(400).json({
          success: false,
          error: "You are not a member of this team",
        });
      }
    }

    // Update registration
    const updatedRegistration = await db
      .update(hackathonParticipants)
      .set({
        participationType,
        teamId: participationType === "team" ? teamId : null,
      })
      .where(
        and(
          eq(hackathonParticipants.hackathonId, hackathonId),
          eq(hackathonParticipants.userId, userId)
        )
      )
      .returning();

    res.json({
      success: true,
      data: updatedRegistration[0],
      message: "Registration updated successfully",
    });
  } catch (error) {
    console.error("Update registration error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getHackathonRegistrations = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 20, participationType } = req.query;

    // Verify user is hackathon organizer
    const hackathon = await db
      .select()
      .from(hackathonsTable)
      .where(
        and(
          eq(hackathonsTable.id, hackathonId),
          eq(hackathonsTable.createdBy, userId)
        )
      )
      .limit(1);

    if (!hackathon.length) {
      return res.status(403).json({
        success: false,
        error:
          "You are not authorized to view registrations for this hackathon",
      });
    }

    const offset = (page - 1) * limit;

    // Build where conditions
    let whereConditions = [eq(hackathonParticipants.hackathonId, hackathonId)];

    if (participationType && ["solo", "team"].includes(participationType)) {
      whereConditions.push(
        eq(hackathonParticipants.participationType, participationType)
      );
    }

    // Get registrations with user and team details
    const registrations = await db
      .select({
        id: hackathonParticipants.id,
        participationType: hackathonParticipants.participationType,
        joinedAt: hackathonParticipants.joinedAt,
        user: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        },
        team: {
          id: teamsTable.id,
          name: teamsTable.teamName,
          memberCount: sql`(SELECT COUNT(*) FROM ${teamMembersTable} WHERE ${teamMembersTable.teamId} = ${teamsTable.id})`,
        },
      })
      .from(hackathonParticipants)
      .leftJoin(usersTable, eq(hackathonParticipants.userId, usersTable.id))
      .leftJoin(teamsTable, eq(hackathonParticipants.teamId, teamsTable.id))
      .where(and(...whereConditions))
      .orderBy(hackathonParticipants.joinedAt)
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCountResult = await db
      .select({
        count: sql`COUNT(*)`,
      })
      .from(hackathonParticipants)
      .where(and(...whereConditions));

    const totalCount = parseInt(totalCountResult[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: {
        registrations,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get hackathon registrations error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getAvailableParticipants = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const { page = 1, limit = 20, skills, interests } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Get solo participants who are not part of any team in this hackathon
    const participants = await db
      .select({
        id: usersTable.id,
        fullName: usersTable.fullName,
        username: usersTable.userName,
        email: usersTable.email,
        bio: usersTable.bio,
        skills: usersTable.skills,
        interests: usersTable.interests,
        avatarUrl: usersTable.avatarUrl,
        location: usersTable.location,
        participationType: hackathonParticipants.participationType,
        registeredAt: hackathonParticipants.registeredAt,
      })
      .from(hackathonParticipants)
      .innerJoin(usersTable, eq(usersTable.id, hackathonParticipants.userId))
      .leftJoin(
        teamMembersTable,
        and(
          eq(teamMembersTable.userId, hackathonParticipants.userId),
          // Only check for teams in this hackathon
          sql`EXISTS (
            SELECT 1 FROM ${teamsTable} 
            WHERE ${teamsTable.id} = ${teamMembersTable.teamId} 
            AND ${teamsTable.hackathonId} = ${hackathonId}
          )`
        )
      )
      .where(
        and(
          eq(hackathonParticipants.hackathonId, hackathonId),
          eq(hackathonParticipants.participationType, "solo"),
          sql`${teamMembersTable.userId} IS NULL` // Not part of any team
        )
      )
      .limit(parseInt(limit))
      .offset(offset);

    // TODO: Add filtering by skills/interests if provided
    // This would require additional SQL logic to filter by array contains

    res.status(200).json({
      success: true,
      data: participants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: participants.length, // For simplicity, using current page length
      },
    });
  } catch (error) {
    console.error("Get available participants error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch available participants",
    });
  }
});
