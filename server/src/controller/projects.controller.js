import { db } from "../db/db.config.js";
import {
  projectsTable,
  projectMatesTable,
} from "../db/schema/project-model.js";
import {
  hackathonParticipants,
  hackathonsTable,
} from "../db/schema/hackathon-model.js";
import { teamMembersTable, teamsTable } from "../db/schema/team-model.js";
import { usersTable } from "../db/schema/users.js";
import { eq, and, desc, sql } from "drizzle-orm";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

export const createProject = asyncHandler(async (req, res) => {
  const { title, description, tags, demoUrl, videoUrl, isPublic } = req.body;
  const creatorId = req.user.id;

  const [project] = await db
    .insert(projectsTable)
    .values({
      creatorId,
      title,
      description,
      tags,
      demoUrl,
      videoUrl,
      isPublic,
    })
    .returning();

  res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

export const getUserProjects = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const projects = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.creatorId, userId));

  res
    .status(200)
    .json(new ApiResponse(200, projects, "User projects fetched successfully"));
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, projectId))
    .limit(1);

  if (project.length === 0) {
    throw new ApiError(404, "Project not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, project[0], "Project fetched successfully"));
});

export const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;
  const updateData = req.body;

  // Verify ownership
  const project = await db
    .select()
    .from(projectsTable)
    .where(
      and(eq(projectsTable.id, projectId), eq(projectsTable.creatorId, userId))
    );

  if (project.length === 0) {
    throw new ApiError(404, "Project not found or unauthorized");
  }

  const [updatedProject] = await db
    .update(projectsTable)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(projectsTable.id, projectId))
    .returning();

  res
    .status(200)
    .json(new ApiResponse(200, updatedProject, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  // Verify ownership
  const project = await db
    .select()
    .from(projectsTable)
    .where(
      and(eq(projectsTable.id, projectId), eq(projectsTable.creatorId, userId))
    )
    .limit(1);

  if (project.length === 0) {
    throw new ApiError(404, "Project not found or unauthorized");
  }

  await db.delete(projectsTable).where(eq(projectsTable.id, projectId));

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Project deleted successfully"));
});

export const createHackathonProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    tags,
    demoUrl,
    videoUrl,
    repositoryUrl,
    hackathonId,
    teamId,
  } = req.body;
  const creatorId = req.user.id;

  // Validate user is registered for this hackathon
  const registration = await db
    .select()
    .from(hackathonParticipants)
    .where(
      and(
        eq(hackathonParticipants.hackathonId, hackathonId),
        eq(hackathonParticipants.userId, creatorId)
      )
    )
    .limit(1);

  if (!registration.length) {
    throw new ApiError(
      403,
      "You must be registered for this hackathon to create a project"
    );
  }

  // If teamId provided, validate team membership
  if (teamId) {
    const teamMembership = await db
      .select()
      .from(teamMembersTable)
      .where(
        and(
          eq(teamMembersTable.teamId, teamId),
          eq(teamMembersTable.userId, creatorId)
        )
      )
      .limit(1);

    if (!teamMembership.length) {
      throw new ApiError(403, "You are not a member of this team");
    }

    // Check if team already has a project for this hackathon
    const existingTeamProject = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.hackathonId, hackathonId),
          eq(projectsTable.teamId, teamId)
        )
      )
      .limit(1);

    if (existingTeamProject.length) {
      throw new ApiError(
        400,
        "Your team already has a project for this hackathon"
      );
    }
  } else {
    // Check if user already has a solo project for this hackathon
    const existingSoloProject = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.hackathonId, hackathonId),
          eq(projectsTable.creatorId, creatorId),
          eq(projectsTable.teamId, null)
        )
      )
      .limit(1);

    if (existingSoloProject.length) {
      throw new ApiError(400, "You already have a project for this hackathon");
    }
  }

  const [project] = await db
    .insert(projectsTable)
    .values({
      creatorId,
      title,
      description,
      tags,
      demoUrl,
      videoUrl,
      repositoryUrl,
      hackathonId,
      teamId,
      submissionStatus: "draft",
      isPublic: true,
    })
    .returning();

  res
    .status(201)
    .json(
      new ApiResponse(201, project, "Hackathon project created successfully")
    );
});

export const submitProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  // Get project with hackathon details
  const project = await db
    .select({
      id: projectsTable.id,
      creatorId: projectsTable.creatorId,
      hackathonId: projectsTable.hackathonId,
      teamId: projectsTable.teamId,
      submissionStatus: projectsTable.submissionStatus,
      title: projectsTable.title,
      hackathonEndDate: hackathonsTable.endDate,
      hackathonStatus: hackathonsTable.status,
    })
    .from(projectsTable)
    .leftJoin(
      hackathonsTable,
      eq(projectsTable.hackathonId, hackathonsTable.id)
    )
    .where(eq(projectsTable.id, projectId))
    .limit(1);

  if (!project.length) {
    throw new ApiError(404, "Project not found");
  }

  const projectData = project[0];

  // Validate this is a hackathon project
  if (!projectData.hackathonId) {
    throw new ApiError(400, "This is not a hackathon project");
  }

  // Validate ownership or team membership
  let canSubmit = projectData.creatorId === userId;

  if (projectData.teamId && !canSubmit) {
    const teamMembership = await db
      .select()
      .from(teamMembersTable)
      .where(
        and(
          eq(teamMembersTable.teamId, projectData.teamId),
          eq(teamMembersTable.userId, userId)
        )
      )
      .limit(1);

    canSubmit = teamMembership.length > 0;
  }

  if (!canSubmit) {
    throw new ApiError(403, "You are not authorized to submit this project");
  }

  // Check if hackathon is still accepting submissions
  if (new Date() > new Date(projectData.hackathonEndDate)) {
    throw new ApiError(400, "Submission deadline has passed");
  }

  if (projectData.submissionStatus === "submitted") {
    throw new ApiError(400, "Project is already submitted");
  }

  // Validate required fields for submission
  const fullProject = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, projectId))
    .limit(1);

  const projectDetails = fullProject[0];

  if (!projectDetails.title || !projectDetails.description) {
    throw new ApiError(
      400,
      "Project must have title and description to be submitted"
    );
  }

  // Submit project
  const [submittedProject] = await db
    .update(projectsTable)
    .set({
      submissionStatus: "submitted",
      submittedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(projectsTable.id, projectId))
    .returning();

  res.json(
    new ApiResponse(200, submittedProject, "Project submitted successfully")
  );
});

export const getHackathonProjects = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const { status = "all", page = 1, limit = 12 } = req.query;

  const offset = (page - 1) * limit;

  let whereConditions = [eq(projectsTable.hackathonId, hackathonId)];

  if (status !== "all") {
    whereConditions.push(eq(projectsTable.submissionStatus, status));
  }

  const projects = await db
    .select({
      id: projectsTable.id,
      title: projectsTable.title,
      description: projectsTable.description,
      tags: projectsTable.tags,
      demoUrl: projectsTable.demoUrl,
      videoUrl: projectsTable.videoUrl,
      repositoryUrl: projectsTable.repositoryUrl,
      submissionStatus: projectsTable.submissionStatus,
      submittedAt: projectsTable.submittedAt,
      images: projectsTable.images,
      likes: projectsTable.likes,
      createdAt: projectsTable.createdAt,
      creatorId: usersTable.id,
      creatorName: usersTable.fullName,
      creatorAvatar: usersTable.avatarUrl,
      teamId: teamsTable.id,
      teamName: teamsTable.teamName,
    })
    .from(projectsTable)
    .leftJoin(usersTable, eq(projectsTable.creatorId, usersTable.id))
    .leftJoin(teamsTable, eq(projectsTable.teamId, teamsTable.id))
    .where(and(...whereConditions))
    .orderBy(desc(projectsTable.submittedAt))
    .limit(parseInt(limit))
    .offset(offset);

  // Transform the flat structure to nested objects
  const transformedProjects = projects.map(project => ({
    ...project,
    creator: {
      id: project.creatorId,
      name: project.creatorName,
      avatar: project.creatorAvatar,
    },
    team: project.teamId ? {
      id: project.teamId,
      name: project.teamName,
    } : null,
    // Remove the flat fields
    creatorId: undefined,
    creatorName: undefined,
    creatorAvatar: undefined,
    teamId: undefined,
    teamName: undefined,
  }));

  // Get total count for pagination
  const [{ count: totalCount }] = await db
    .select({ count: sql`count(*)` })
    .from(projectsTable)
    .where(and(...whereConditions));

  res.json(
    new ApiResponse(
      200,
      {
        projects: transformedProjects,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount: parseInt(totalCount),
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPrevPage: page > 1,
        },
      },
      "Hackathon projects retrieved successfully"
    )
  );
});

export const getMyHackathonProjects = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { hackathonId } = req.params;

  const projects = await db
    .select({
      id: projectsTable.id,
      title: projectsTable.title,
      description: projectsTable.description,
      submissionStatus: projectsTable.submissionStatus,
      submittedAt: projectsTable.submittedAt,
      demoUrl: projectsTable.demoUrl,
      videoUrl: projectsTable.videoUrl,
      repositoryUrl: projectsTable.repositoryUrl,
      tags: projectsTable.tags,
      images: projectsTable.images,
      createdAt: projectsTable.createdAt,
      team: {
        id: teamsTable.id,
        name: teamsTable.teamName,
      },
    })
    .from(projectsTable)
    .leftJoin(teamsTable, eq(projectsTable.teamId, teamsTable.id))
    .where(
      and(
        eq(projectsTable.hackathonId, hackathonId),
        eq(projectsTable.creatorId, userId)
      )
    )
    .orderBy(desc(projectsTable.createdAt));

  res.json(
    new ApiResponse(
      200,
      { projects },
      "Your hackathon projects retrieved successfully"
    )
  );
});

export const updateHackathonProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, tags, demoUrl, videoUrl, repositoryUrl } =
    req.body;
  const userId = req.user.id;

  // Get project details
  const project = await db
    .select({
      id: projectsTable.id,
      creatorId: projectsTable.creatorId,
      teamId: projectsTable.teamId,
      submissionStatus: projectsTable.submissionStatus,
      hackathonEndDate: hackathonsTable.endDate,
    })
    .from(projectsTable)
    .leftJoin(
      hackathonsTable,
      eq(projectsTable.hackathonId, hackathonsTable.id)
    )
    .where(eq(projectsTable.id, projectId))
    .limit(1);

  if (!project.length) {
    throw new ApiError(404, "Project not found");
  }

  const projectData = project[0];

  // Check if user can edit (creator or team member)
  let canEdit = projectData.creatorId === userId;

  if (projectData.teamId && !canEdit) {
    const teamMembership = await db
      .select()
      .from(teamMembersTable)
      .where(
        and(
          eq(teamMembersTable.teamId, projectData.teamId),
          eq(teamMembersTable.userId, userId)
        )
      )
      .limit(1);

    canEdit = teamMembership.length > 0;
  }

  if (!canEdit) {
    throw new ApiError(403, "You are not authorized to edit this project");
  }

  // Check if editing is allowed (before deadline and not judged)
  if (new Date() > new Date(projectData.hackathonEndDate)) {
    throw new ApiError(400, "Cannot edit project after hackathon deadline");
  }

  if (projectData.submissionStatus === "judged") {
    throw new ApiError(400, "Cannot edit project that has been judged");
  }

  // Update project
  const [updatedProject] = await db
    .update(projectsTable)
    .set({
      title,
      description,
      tags,
      demoUrl,
      videoUrl,
      repositoryUrl,
      updatedAt: new Date(),
    })
    .where(eq(projectsTable.id, projectId))
    .returning();

  res.json(
    new ApiResponse(200, updatedProject, "Project updated successfully")
  );
});

export const withdrawSubmission = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  // Get project details
  const project = await db
    .select({
      id: projectsTable.id,
      creatorId: projectsTable.creatorId,
      teamId: projectsTable.teamId,
      submissionStatus: projectsTable.submissionStatus,
      hackathonEndDate: hackathonsTable.endDate,
    })
    .from(projectsTable)
    .leftJoin(
      hackathonsTable,
      eq(projectsTable.hackathonId, hackathonsTable.id)
    )
    .where(eq(projectsTable.id, projectId))
    .limit(1);

  if (!project.length) {
    throw new ApiError(404, "Project not found");
  }

  const projectData = project[0];

  // Validate ownership
  let canWithdraw = projectData.creatorId === userId;

  if (projectData.teamId && !canWithdraw) {
    const teamMembership = await db
      .select()
      .from(teamMembersTable)
      .where(
        and(
          eq(teamMembersTable.teamId, projectData.teamId),
          eq(teamMembersTable.userId, userId),
          eq(teamMembersTable.role, "leader") // Only team leader can withdraw
        )
      )
      .limit(1);

    canWithdraw = teamMembership.length > 0;
  }

  if (!canWithdraw) {
    throw new ApiError(
      403,
      "You are not authorized to withdraw this submission"
    );
  }

  if (projectData.submissionStatus !== "submitted") {
    throw new ApiError(400, "Project is not submitted");
  }

  if (new Date() > new Date(projectData.hackathonEndDate)) {
    throw new ApiError(400, "Cannot withdraw submission after deadline");
  }

  // Withdraw submission
  const [withdrawnProject] = await db
    .update(projectsTable)
    .set({
      submissionStatus: "draft",
      submittedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(projectsTable.id, projectId))
    .returning();

  res.json(
    new ApiResponse(200, withdrawnProject, "Submission withdrawn successfully")
  );
});
