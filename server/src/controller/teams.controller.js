import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { db } from "../db/db.config.js";
import {
  teamsTable,
  teamMembersTable,
  usersTable,
  hackathonsTable,
  hackathonParticipants,
} from "../db/schema/index.js";
import { eq, and, ne } from "drizzle-orm";

export const createTeam = asyncHandler(async (req, res) => {
  const { name, description, hackathonId } = req.body;
  const requesterId = req.user.id;

  // Check if hackathon exists
  const hackathon = await db
    .select()
    .from(hackathonsTable)
    .where(eq(hackathonsTable.id, hackathonId))
    .limit(1);

  if (hackathon.length === 0) {
    throw new ApiError(404, "Hackathon not found");
  }

  // check if hackathon is ongoing or upcoming
  if (hackathon[0].status !== "ongoing" && hackathon[0].status !== "upcoming") {
    throw new ApiError(400, "Hackathon is not open for team creation");
  }
  // Check if user is a part of any team in this hackathon
  const teamMembership = await db
    .select({ teamId: teamMembersTable.teamId })
    .from(teamMembersTable)
    .innerJoin(teamsTable, eq(teamsTable.id, teamMembersTable.teamId))
    .where(
      and(
        eq(teamMembersTable.userId, requesterId),
        eq(teamsTable.hackathonId, hackathonId)
      )
    );

  if (teamMembership.length > 0) {
    throw new ApiError(409, "You already have a team in this hackathon");
  }

  const [team] = await db
    .insert(teamsTable)
    .values({ teamName: name, description, hackathonId, leaderId: requesterId })
    .returning();

  // Add creator as team leader
  await db.insert(teamMembersTable).values({
    teamId: team.id,
    userId: requesterId,
    role: "leader",
  });

  await db.insert(hackathonParticipants).values({
    hackathonId,
    userId: requesterId,
    participationType: "team", // Assuming participants are automatically added
    teamId: team.id,
    joinedAt: new Date(),
  });

  // Transform the team data to match frontend expectations
  const transformedTeam = {
    ...team,
    name: team.teamName, // Map teamName to name for frontend
  };

  res
    .status(201)
    .json(new ApiResponse(201, transformedTeam, "Team created successfully"));
});

export const getTeamById = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await db
    .select({
      id: teamsTable.id,
      name: teamsTable.teamName,
      description: teamsTable.description,
      hackathonId: teamsTable.hackathonId,
      leaderId: teamsTable.leaderId,
      maxMembers: teamsTable.maxMembers,
      isOpen: teamsTable.isOpen,
      createdAt: teamsTable.createdAt,
    })
    .from(teamsTable)
    .where(eq(teamsTable.id, teamId))
    .limit(1);

  if (team.length === 0) {
    throw new ApiError(404, "Team not found");
  }

  // Get team members
  const members = await db
    .select({
      userId: teamMembersTable.userId,
      role: teamMembersTable.role,
      joinedAt: teamMembersTable.joinedAt,
      username: usersTable.userName,
      fullName: usersTable.fullName,
      email: usersTable.email,
      avatar: usersTable.avatarUrl,
    })
    .from(teamMembersTable)
    .innerJoin(usersTable, eq(usersTable.id, teamMembersTable.userId))
    .where(eq(teamMembersTable.teamId, teamId));

  const teamData = {
    ...team[0],
    members,
    memberCount: members.length,
  };

  res
    .status(200)
    .json(new ApiResponse(200, teamData, "Team fetched successfully"));
});

export const joinTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const userId = req.user.id;

  // Check if team exists
  const team = await db
    .select()
    .from(teamsTable)
    .where(eq(teamsTable.id, teamId))
    .limit(1);

  if (team.length === 0) {
    throw new ApiError(404, "Team not found");
  }

  const hackathonId = team[0].hackathonId;

  // Check if user already has a team in this hackathon
  const existingTeam = await db
    .select({ teamId: teamMembersTable.teamId })
    .from(teamMembersTable)
    .innerJoin(teamsTable, eq(teamsTable.id, teamMembersTable.teamId))
    .where(
      and(
        eq(teamMembersTable.userId, userId),
        eq(teamsTable.hackathonId, hackathonId)
      )
    );

  if (existingTeam.length > 0) {
    throw new ApiError(409, "You already have a team in this hackathon");
  }

  // Check team size limit
  const hackathon = await db
    .select({ maxTeamSize: hackathonsTable.maxTeamSize })
    .from(hackathonsTable)
    .where(eq(hackathonsTable.id, hackathonId))
    .limit(1);

  const currentMembers = await db
    .select({ userId: teamMembersTable.userId })
    .from(teamMembersTable)
    .where(eq(teamMembersTable.teamId, teamId));

  if (currentMembers.length >= hackathon[0].maxTeamSize) {
    throw new ApiError(409, "Team is already full");
  }

  const [member] = await db
    .insert(teamMembersTable)
    .values({ teamId, userId, role: "member" })
    .returning();

  await db.insert(hackathonParticipants).values({
    hackathonId,
    userId,
    participationType: "team",
    teamId,
    joinedAt: new Date(),
  });

  res
    .status(201)
    .json(new ApiResponse(201, member, "Successfully joined team"));
});

export const leaveTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const userId = req.user.id;

  // Check if user is in the team
  const membership = await db
    .select()
    .from(teamMembersTable)
    .where(
      and(
        eq(teamMembersTable.teamId, teamId),
        eq(teamMembersTable.userId, userId)
      )
    )
    .limit(1);

  if (membership.length === 0) {
    throw new ApiError(404, "You are not a member of this team");
  }

  const userRole = membership[0].role;

  // If user is the leader, check if there are other members
  if (userRole === "leader") {
    const otherMembers = await db
      .select()
      .from(teamMembersTable)
      .where(
        and(
          eq(teamMembersTable.teamId, teamId),
          ne(teamMembersTable.userId, userId)
        )
      );

    if (otherMembers.length > 0) {
      throw new ApiError(
        400,
        "You must transfer leadership or remove all members before leaving"
      );
    }

    // If no other members, delete the entire team
    await db
      .delete(teamMembersTable)
      .where(eq(teamMembersTable.teamId, teamId));
    await db.delete(teamsTable).where(eq(teamsTable.id, teamId));

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Team disbanded successfully"));
  } else {
    // Remove member
    await db
      .delete(teamMembersTable)
      .where(
        and(
          eq(teamMembersTable.teamId, teamId),
          eq(teamMembersTable.userId, userId)
        )
      );

    res.status(200).json(new ApiResponse(200, {}, "Left team successfully"));
  }
});

export const removeMember = asyncHandler(async (req, res) => {
  const { teamId, userId } = req.params;
  const requesterId = req.user.id;

  // Check if requester is team leader
  const requesterMembership = await db
    .select()
    .from(teamMembersTable)
    .where(
      and(
        eq(teamMembersTable.teamId, teamId),
        eq(teamMembersTable.userId, requesterId)
      )
    )
    .limit(1);

  if (
    requesterMembership.length === 0 ||
    requesterMembership[0].role !== "leader"
  ) {
    throw new ApiError(403, "Only team leader can remove members");
  }

  // Check if target user is in the team
  const targetMembership = await db
    .select()
    .from(teamMembersTable)
    .where(
      and(
        eq(teamMembersTable.teamId, teamId),
        eq(teamMembersTable.userId, userId)
      )
    )
    .limit(1);

  if (targetMembership.length === 0) {
    throw new ApiError(404, "User is not a member of this team");
  }

  // Leader cannot remove themselves using this endpoint
  if (requesterId === userId) {
    throw new ApiError(400, "Use leave team endpoint to leave as leader");
  }

  // Remove the member
  await db
    .delete(teamMembersTable)
    .where(
      and(
        eq(teamMembersTable.teamId, teamId),
        eq(teamMembersTable.userId, userId)
      )
    );

  res.status(200).json(new ApiResponse(200, {}, "Member removed successfully"));
});

export const transferLeadership = asyncHandler(async (req, res) => {
  const { teamId, userId } = req.params;
  const currentLeaderId = req.user.id;

  // Check if requester is current team leader
  const currentLeader = await db
    .select()
    .from(teamMembersTable)
    .where(
      and(
        eq(teamMembersTable.teamId, teamId),
        eq(teamMembersTable.userId, currentLeaderId)
      )
    )
    .limit(1);

  if (currentLeader.length === 0 || currentLeader[0].role !== "leader") {
    throw new ApiError(403, "Only current team leader can transfer leadership");
  }

  // Check if target user is in the team
  const targetMember = await db
    .select()
    .from(teamMembersTable)
    .where(
      and(
        eq(teamMembersTable.teamId, teamId),
        eq(teamMembersTable.userId, userId)
      )
    )
    .limit(1);

  if (targetMember.length === 0) {
    throw new ApiError(404, "Target user is not a member of this team");
  }

  // Update roles in a transaction
  await db.transaction(async (tx) => {
    // Make current leader a member
    await tx
      .update(teamMembersTable)
      .set({ role: "member" })
      .where(
        and(
          eq(teamMembersTable.teamId, teamId),
          eq(teamMembersTable.userId, currentLeaderId)
        )
      );

    // Make target user the leader
    await tx
      .update(teamMembersTable)
      .set({ role: "leader" })
      .where(
        and(
          eq(teamMembersTable.teamId, teamId),
          eq(teamMembersTable.userId, userId)
        )
      );

    // Update team leaderId field
    await tx
      .update(teamsTable)
      .set({ leaderId: userId })
      .where(eq(teamsTable.id, teamId));
  });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Leadership transferred successfully"));
});

export const updateTeamInfo = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const userId = req.user.id;
  const { teamName, description } = req.body;

  // Check if user is team leader
  const membership = await db
    .select()
    .from(teamMembersTable)
    .where(
      and(
        eq(teamMembersTable.teamId, teamId),
        eq(teamMembersTable.userId, userId)
      )
    )
    .limit(1);

  if (membership.length === 0 || membership[0].role !== "leader") {
    throw new ApiError(403, "Only team leader can update team details");
  }

  const [updatedTeam] = await db
    .update(teamsTable)
    .set({ teamName, description, updatedAt: new Date() })
    .where(eq(teamsTable.id, teamId))
    .returning();

  // Transform the team data to match frontend expectations
  const transformedTeam = {
    ...updatedTeam,
    name: updatedTeam.teamName, // Map teamName to name for frontend
  };

  res
    .status(200)
    .json(new ApiResponse(200, transformedTeam, "Team updated successfully"));
});

export const getTeamsByHackathon = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // Validate hackathon exists first
  const hackathon = await db
    .select()
    .from(hackathonsTable)
    .where(eq(hackathonsTable.id, hackathonId))
    .limit(1);

  if (hackathon.length === 0) {
    throw new ApiError(404, "Hackathon not found");
  }

  const teams = await db
    .select({
      id: teamsTable.id,
      name: teamsTable.teamName,
      description: teamsTable.description,
      maxMembers: teamsTable.maxMembers,
      isOpen: teamsTable.isOpen,
      leaderId: teamsTable.leaderId,
      createdAt: teamsTable.createdAt,
    })
    .from(teamsTable)
    .where(eq(teamsTable.hackathonId, hackathonId))
    .limit(Number(limit))
    .offset(Number(offset));

  // Get member count and leader info for each team
  const teamsWithDetails = await Promise.all(
    teams.map(async (team) => {
      try {
        // Get member count
        const memberCount = await db
          .select()
          .from(teamMembersTable)
          .where(eq(teamMembersTable.teamId, team.id));

        // Get leader info
        const leader = await db
          .select({
            name: usersTable.fullName,
            username: usersTable.userName,
            avatar: usersTable.avatarUrl,
          })
          .from(usersTable)
          .where(eq(usersTable.id, team.leaderId))
          .limit(1);

        return {
          ...team,
          memberCount: memberCount.length,
          leader: leader.length > 0 ? leader[0] : null,
        };
      } catch (error) {
        console.error(`Error processing team ${team.id}:`, error);
        return {
          ...team,
          memberCount: 0,
          leader: null,
        };
      }
    })
  );

  res
    .status(200)
    .json(new ApiResponse(200, teamsWithDetails, "Teams fetched successfully"));
});

export const getUserTeams = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const userTeams = await db
    .select({
      teamId: teamMembersTable.teamId,
      role: teamMembersTable.role,
      teamName: teamsTable.teamName,
      teamDescription: teamsTable.description,
      hackathonId: teamsTable.hackathonId,
    })
    .from(teamMembersTable)
    .innerJoin(teamsTable, eq(teamsTable.id, teamMembersTable.teamId))
    .where(eq(teamMembersTable.userId, userId));

  res
    .status(200)
    .json(new ApiResponse(200, userTeams, "User teams fetched successfully"));
});

export const searchTeams = async (req, res) => {
  try {
    const {
      hackathonId,
      skills,
      isOpen = true,
      page = 1,
      limit = 12,
      search,
    } = req.query;

    // Build search conditions
    let whereConditions = [];

    if (hackathonId) {
      whereConditions.push(eq(teamsTable.hackathonId, hackathonId));
    }

    if (isOpen === "true") {
      whereConditions.push(eq(teamsTable.isOpen, true));
    }

    // Search teams with member count and availability
    const teams = await db
      .select({
        id: teamsTable.id,
        teamName: teamsTable.teamName,
        description: teamsTable.description,
        maxMembers: teamsTable.maxMembers,
        isOpen: teamsTable.isOpen,
        hackathonId: teamsTable.hackathonId,
        leaderId: teamsTable.leaderId,
        createdAt: teamsTable.createdAt,
        leader: {
          name: usersTable.name,
          avatar: usersTable.avatar,
        },
        memberCount: sql`(SELECT COUNT(*) FROM ${teamMembersTable} WHERE ${teamMembersTable.teamId} = ${teamsTable.id})`,
        availableSpots: sql`(${teamsTable.maxMembers} - (SELECT COUNT(*) FROM ${teamMembersTable} WHERE ${teamMembersTable.teamId} = ${teamsTable.id}))`,
      })
      .from(teamsTable)
      .leftJoin(usersTable, eq(teamsTable.leaderId, usersTable.id))
      .where(and(...whereConditions))
      .having(
        sql`(${teamsTable.maxMembers} - (SELECT COUNT(*) FROM ${teamMembersTable} WHERE ${teamMembersTable.teamId} = ${teamsTable.id})) > 0`
      )
      .orderBy(desc(teamsTable.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    res.json({
      success: true,
      data: { teams },
    });
  } catch (error) {
    console.error("Search teams error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
