import { db } from "../db/db.config.js";
import {
  teamInvitationsTable,
  teamsTable,
  teamMembersTable,
  usersTable,
  hackathonsTable,
} from "../db/schema/index.js";
import { eq, and, or, desc, sql } from "drizzle-orm";

export const sendTeamInvitation = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { email, message } = req.body;
    const inviterId = req.user.id;

    // Find invitee by email
    const invitee = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!invitee.length) {
      return res.status(404).json({
        success: false,
        error: "User not found with this email",
      });
    }

    const inviteeData = invitee[0];

    // Prevent self-invitation
    if (inviteeData.id === inviterId) {
      return res.status(400).json({
        success: false,
        error: "You cannot invite yourself to a team",
      });
    }

    // Check if user is team member/leader with team details
    const teamWithMembership = await db
      .select({
        teamId: teamsTable.id,
        teamName: teamsTable.teamName,
        leaderId: teamsTable.leaderId,
        isOpen: teamsTable.isOpen,
        maxMembers: teamsTable.maxMembers,
        hackathonId: teamsTable.hackathonId,
        userRole: teamMembersTable.role,
        memberCount: sql`(SELECT COUNT(*) FROM ${teamMembersTable} WHERE ${teamMembersTable.teamId} = ${teamsTable.id})`,
      })
      .from(teamsTable)
      .leftJoin(
        teamMembersTable,
        and(
          eq(teamMembersTable.teamId, teamsTable.id),
          eq(teamMembersTable.userId, inviterId)
        )
      )
      .where(eq(teamsTable.id, teamId))
      .limit(1);

    if (!teamWithMembership.length || !teamWithMembership[0].userRole) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to send invitations for this team",
      });
    }

    const teamData = teamWithMembership[0];

    // Check if team is open for new members
    if (!teamData.isOpen) {
      return res.status(400).json({
        success: false,
        error: "This team is not accepting new members",
      });
    }

    // Check team size limit
    if (teamData.memberCount >= teamData.maxMembers) {
      return res.status(400).json({
        success: false,
        error: "Team has reached maximum member limit",
      });
    }

    // Check if invitee is already a team member
    const existingMember = await db
      .select()
      .from(teamMembersTable)
      .where(
        and(
          eq(teamMembersTable.teamId, teamId),
          eq(teamMembersTable.userId, inviteeData.id)
        )
      )
      .limit(1);

    if (existingMember.length) {
      return res.status(400).json({
        success: false,
        error: "User is already a member of this team",
      });
    }

    // Check for existing pending invitation
    const existingInvitation = await db
      .select()
      .from(teamInvitationsTable)
      .where(
        and(
          eq(teamInvitationsTable.teamId, teamId),
          eq(teamInvitationsTable.inviteeId, inviteeData.id),
          eq(teamInvitationsTable.status, "pending")
        )
      )
      .limit(1);

    if (existingInvitation.length) {
      return res.status(400).json({
        success: false,
        error: "User already has a pending invitation for this team",
      });
    }

    // Create invitation with 7 days expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await db
      .insert(teamInvitationsTable)
      .values({
        teamId,
        inviterId,
        inviteeId: inviteeData.id,
        message: message || null,
        expiresAt,
      })
      .returning();

    // Get complete invitation data for response
    const completeInvitation = await db
      .select({
        id: teamInvitationsTable.id,
        teamId: teamInvitationsTable.teamId,
        inviterId: teamInvitationsTable.inviterId,
        inviteeId: teamInvitationsTable.inviteeId,
        status: teamInvitationsTable.status,
        message: teamInvitationsTable.message,
        invitedAt: teamInvitationsTable.invitedAt,
        expiresAt: teamInvitationsTable.expiresAt,
        teamName: teamsTable.teamName,
        inviterName: usersTable.name,
        inviteeName: inviteeData.name,
      })
      .from(teamInvitationsTable)
      .leftJoin(teamsTable, eq(teamInvitationsTable.teamId, teamsTable.id))
      .leftJoin(usersTable, eq(teamInvitationsTable.inviterId, usersTable.id))
      .where(eq(teamInvitationsTable.id, invitation[0].id))
      .limit(1);

    res.status(201).json({
      success: true,
      data: completeInvitation[0],
      message: `Invitation sent to ${inviteeData.name} successfully`,
    });
  } catch (error) {
    console.error("Send invitation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getMyInvitations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status = "pending", page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    // Build where conditions
    let whereConditions = [eq(teamInvitationsTable.inviteeId, userId)];

    if (status !== "all") {
      whereConditions.push(eq(teamInvitationsTable.status, status));
    }

    // Get invitations with team and inviter details
    const invitations = await db
      .select({
        id: teamInvitationsTable.id,
        teamId: teamInvitationsTable.teamId,
        inviterId: teamInvitationsTable.inviterId,
        status: teamInvitationsTable.status,
        message: teamInvitationsTable.message,
        invitedAt: teamInvitationsTable.invitedAt,
        respondedAt: teamInvitationsTable.respondedAt,
        expiresAt: teamInvitationsTable.expiresAt,
        team: {
          id: teamsTable.id,
          name: teamsTable.teamName,
          description: teamsTable.description,
          maxMembers: teamsTable.maxMembers,
          hackathonId: teamsTable.hackathonId,
        },
        inviter: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        },
        hackathon: {
          id: hackathonsTable.id,
          title: hackathonsTable.title,
          status: hackathonsTable.status,
        },
        memberCount: sql`(SELECT COUNT(*) FROM ${teamMembersTable} WHERE ${teamMembersTable.teamId} = ${teamsTable.id})`,
      })
      .from(teamInvitationsTable)
      .leftJoin(teamsTable, eq(teamInvitationsTable.teamId, teamsTable.id))
      .leftJoin(usersTable, eq(teamInvitationsTable.inviterId, usersTable.id))
      .leftJoin(hackathonsTable, eq(teamsTable.hackathonId, hackathonsTable.id))
      .where(and(...whereConditions))
      .orderBy(desc(teamInvitationsTable.invitedAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({
        count: sql`COUNT(*)`,
      })
      .from(teamInvitationsTable)
      .where(and(...whereConditions));

    const totalCount = parseInt(totalCountResult[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    // Mark expired invitations
    const now = new Date();
    const expiredInvitations = invitations.filter(
      (inv) => inv.status === "pending" && new Date(inv.expiresAt) < now
    );

    if (expiredInvitations.length > 0) {
      const expiredIds = expiredInvitations.map((inv) => inv.id);
      await db
        .update(teamInvitationsTable)
        .set({
          status: "expired",
          respondedAt: now,
        })
        .where(sql`${teamInvitationsTable.id} = ANY(${expiredIds})`);
    }

    res.json({
      success: true,
      data: {
        invitations: invitations.map((inv) => ({
          ...inv,
          status: expiredInvitations.find((exp) => exp.id === inv.id)
            ? "expired"
            : inv.status,
          isExpired: new Date(inv.expiresAt) < now,
        })),
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
    console.error("Get my invitations error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getTeamInvitations = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;
    const { status = "all", page = 1, limit = 10 } = req.query;

    // Verify user is team member/leader
    const teamMembership = await db
      .select({
        role: teamMembersTable.role,
        teamName: teamsTable.teamName,
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
      return res.status(403).json({
        success: false,
        error: "You are not authorized to view invitations for this team",
      });
    }

    const offset = (page - 1) * limit;

    // Build where conditions
    let whereConditions = [eq(teamInvitationsTable.teamId, teamId)];

    if (status !== "all") {
      whereConditions.push(eq(teamInvitationsTable.status, status));
    }

    // Get team invitations with invitee and inviter details
    const invitations = await db
      .select({
        id: teamInvitationsTable.id,
        inviterId: teamInvitationsTable.inviterId,
        inviteeId: teamInvitationsTable.inviteeId,
        status: teamInvitationsTable.status,
        message: teamInvitationsTable.message,
        invitedAt: teamInvitationsTable.invitedAt,
        respondedAt: teamInvitationsTable.respondedAt,
        expiresAt: teamInvitationsTable.expiresAt,
        inviter: {
          id: usersTable.id,
          name: usersTable.name,
        },
        invitee: {
          id: sql`invitee.id`,
          name: sql`invitee.name`,
          email: sql`invitee.email`,
        },
      })
      .from(teamInvitationsTable)
      .leftJoin(usersTable, eq(teamInvitationsTable.inviterId, usersTable.id))
      .leftJoin(
        sql`${usersTable} AS invitee`,
        sql`${teamInvitationsTable.inviteeId} = invitee.id`
      )
      .where(and(...whereConditions))
      .orderBy(desc(teamInvitationsTable.invitedAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCountResult = await db
      .select({
        count: sql`COUNT(*)`,
      })
      .from(teamInvitationsTable)
      .where(and(...whereConditions));

    const totalCount = parseInt(totalCountResult[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: {
        teamName: teamMembership[0].teamName,
        invitations,
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
    console.error("Get team invitations error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.id;

    // Get invitation details with team info
    const invitation = await db
      .select({
        id: teamInvitationsTable.id,
        teamId: teamInvitationsTable.teamId,
        inviteeId: teamInvitationsTable.inviteeId,
        status: teamInvitationsTable.status,
        expiresAt: teamInvitationsTable.expiresAt,
        teamName: teamsTable.teamName,
        maxMembers: teamsTable.maxMembers,
        hackathonId: teamsTable.hackathonId,
        memberCount: sql`(SELECT COUNT(*) FROM ${teamMembersTable} WHERE ${teamMembersTable.teamId} = ${teamsTable.id})`,
      })
      .from(teamInvitationsTable)
      .leftJoin(teamsTable, eq(teamInvitationsTable.teamId, teamsTable.id))
      .where(
        and(
          eq(teamInvitationsTable.id, invitationId),
          eq(teamInvitationsTable.inviteeId, userId)
        )
      )
      .limit(1);

    if (!invitation.length) {
      return res.status(404).json({
        success: false,
        error: "Invitation not found or you are not authorized to accept it",
      });
    }

    const invitationData = invitation[0];

    // Check invitation status
    if (invitationData.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: `Invitation has already been ${invitationData.status}`,
      });
    }

    // Check if invitation is expired
    if (new Date() > new Date(invitationData.expiresAt)) {
      // Mark as expired
      await db
        .update(teamInvitationsTable)
        .set({
          status: "expired",
          respondedAt: new Date(),
        })
        .where(eq(teamInvitationsTable.id, invitationId));

      return res.status(400).json({
        success: false,
        error: "Invitation has expired",
      });
    }

    // Check if team is full
    if (invitationData.memberCount >= invitationData.maxMembers) {
      return res.status(400).json({
        success: false,
        error: "Team has reached maximum member limit",
      });
    }

    // Check if user is already a member of this team
    const existingMember = await db
      .select()
      .from(teamMembersTable)
      .where(
        and(
          eq(teamMembersTable.teamId, invitationData.teamId),
          eq(teamMembersTable.userId, userId)
        )
      )
      .limit(1);

    if (existingMember.length) {
      return res.status(400).json({
        success: false,
        error: "You are already a member of this team",
      });
    }

    // Begin transaction
    await db.transaction(async (tx) => {
      // Add user to team
      await tx.insert(teamMembersTable).values({
        teamId: invitationData.teamId,
        userId,
        role: "member",
      });

      // Update invitation status
      await tx
        .update(teamInvitationsTable)
        .set({
          status: "accepted",
          respondedAt: new Date(),
        })
        .where(eq(teamInvitationsTable.id, invitationId));

      // Decline any other pending invitations for the same team (prevent duplicate memberships)
      await tx
        .update(teamInvitationsTable)
        .set({
          status: "declined",
          respondedAt: new Date(),
        })
        .where(
          and(
            eq(teamInvitationsTable.teamId, invitationData.teamId),
            eq(teamInvitationsTable.inviteeId, userId),
            eq(teamInvitationsTable.status, "pending"),
            sql`${teamInvitationsTable.id} != ${invitationId}`
          )
        );
    });

    res.json({
      success: true,
      message: `Successfully joined ${invitationData.teamName}`,
      data: {
        teamId: invitationData.teamId,
        teamName: invitationData.teamName,
        hackathonId: invitationData.hackathonId,
      },
    });
  } catch (error) {
    console.error("Accept invitation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const declineInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.id;

    // Get invitation details
    const invitation = await db
      .select({
        id: teamInvitationsTable.id,
        status: teamInvitationsTable.status,
        teamName: teamsTable.teamName,
      })
      .from(teamInvitationsTable)
      .leftJoin(teamsTable, eq(teamInvitationsTable.teamId, teamsTable.id))
      .where(
        and(
          eq(teamInvitationsTable.id, invitationId),
          eq(teamInvitationsTable.inviteeId, userId)
        )
      )
      .limit(1);

    if (!invitation.length) {
      return res.status(404).json({
        success: false,
        error: "Invitation not found or you are not authorized to decline it",
      });
    }

    const invitationData = invitation[0];

    if (invitationData.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: `Invitation has already been ${invitationData.status}`,
      });
    }

    // Update invitation status
    await db
      .update(teamInvitationsTable)
      .set({
        status: "declined",
        respondedAt: new Date(),
      })
      .where(eq(teamInvitationsTable.id, invitationId));

    res.json({
      success: true,
      message: `Declined invitation to join ${invitationData.teamName}`,
    });
  } catch (error) {
    console.error("Decline invitation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const cancelInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.id;

    // Get invitation details and verify permissions
    const invitation = await db
      .select({
        id: teamInvitationsTable.id,
        teamId: teamInvitationsTable.teamId,
        inviterId: teamInvitationsTable.inviterId,
        status: teamInvitationsTable.status,
        teamName: teamsTable.teamName,
        inviteeName: usersTable.name,
      })
      .from(teamInvitationsTable)
      .leftJoin(teamsTable, eq(teamInvitationsTable.teamId, teamsTable.id))
      .leftJoin(usersTable, eq(teamInvitationsTable.inviteeId, usersTable.id))
      .where(eq(teamInvitationsTable.id, invitationId))
      .limit(1);

    if (!invitation.length) {
      return res.status(404).json({
        success: false,
        error: "Invitation not found",
      });
    }

    const invitationData = invitation[0];

    // Check if user is authorized (inviter or team leader)
    const teamMembership = await db
      .select({
        role: teamMembersTable.role,
      })
      .from(teamMembersTable)
      .where(
        and(
          eq(teamMembersTable.teamId, invitationData.teamId),
          eq(teamMembersTable.userId, userId)
        )
      )
      .limit(1);

    const isInviter = invitationData.inviterId === userId;
    const isTeamLeader =
      teamMembership.length > 0 && teamMembership[0].role === "leader";

    if (!isInviter && !isTeamLeader) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to cancel this invitation",
      });
    }

    if (invitationData.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel invitation that has been ${invitationData.status}`,
      });
    }

    // Cancel invitation
    await db
      .update(teamInvitationsTable)
      .set({
        status: "cancelled",
        respondedAt: new Date(),
      })
      .where(eq(teamInvitationsTable.id, invitationId));

    res.json({
      success: true,
      message: `Cancelled invitation for ${invitationData.inviteeName} to join ${invitationData.teamName}`,
    });
  } catch (error) {
    console.error("Cancel invitation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Utility function to clean up expired invitations (can be called via cron job)
export const cleanupExpiredInvitations = async () => {
  try {
    const now = new Date();

    const expiredInvitations = await db
      .update(teamInvitationsTable)
      .set({
        status: "expired",
        respondedAt: now,
      })
      .where(
        and(
          eq(teamInvitationsTable.status, "pending"),
          sql`${teamInvitationsTable.expiresAt} < ${now}`
        )
      )
      .returning({ id: teamInvitationsTable.id });

    console.log(`Cleaned up ${expiredInvitations.length} expired invitations`);
    return expiredInvitations.length;
  } catch (error) {
    console.error("Cleanup expired invitations error:", error);
    throw error;
  }
};
