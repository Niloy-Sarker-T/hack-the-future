import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { db } from "../db/db.config.js";
import {
  judgesTable,
  hackathonsTable,
  usersTable,
  projectsTable,
  teamsTable,
  projectEvaluationsTable,
} from "../db/schema/index.js";
import { eq, and, inArray } from "drizzle-orm";

// Assign judges to a hackathon (organizer only)
export const assignJudges = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const { judges } = req.body; // Array of { userId?, email?, role? }
  const organizerId = req.user.id;

  // Verify organizer owns this hackathon
  const hackathon = await db
    .select()
    .from(hackathonsTable)
    .where(
      and(
        eq(hackathonsTable.id, hackathonId),
        eq(hackathonsTable.createdBy, organizerId)
      )
    )
    .limit(1);

  if (!hackathon.length) {
    throw new ApiError(404, "Hackathon not found or unauthorized");
  }

  const assignedJudges = [];

  for (const judge of judges) {
    const [assignedJudge] = await db
      .insert(judgesTable)
      .values({
        hackathonId,
        userId: judge.userId || null,
        externalJudgeEmail: judge.externalJudgeEmail || null,
        role: judge.role || "judge",
      })
      .returning();

    assignedJudges.push(assignedJudge);
  }

  res
    .status(201)
    .json(new ApiResponse(201, assignedJudges, "Judges assigned successfully"));
});

// Get judges for a hackathon
export const getHackathonJudges = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;

  const judges = await db
    .select({
      id: judgesTable.id,
      role: judgesTable.role,
      assignedAt: judgesTable.assignedAt,
      externalJudgeEmail: judgesTable.externalJudgeEmail,
      judge: {
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
        avatarUrl: usersTable.avatarUrl,
      },
    })
    .from(judgesTable)
    .leftJoin(usersTable, eq(judgesTable.userId, usersTable.id))
    .where(eq(judgesTable.hackathonId, hackathonId));

  res.json(
    new ApiResponse(200, judges, "Hackathon judges retrieved successfully")
  );
});

// Get hackathons assigned to a judge
export const getMyJudgeAssignments = asyncHandler(async (req, res) => {
  const judgeId = req.user.id;

  const assignments = await db
    .select({
      id: judgesTable.id,
      role: judgesTable.role,
      assignedAt: judgesTable.assignedAt,
      hackathon: {
        id: hackathonsTable.id,
        title: hackathonsTable.title,
        description: hackathonsTable.description,
        status: hackathonsTable.status,
        judgingCriteria: hackathonsTable.judgingCriteria,
        submissionDeadline: hackathonsTable.submissionDeadline,
        thumbnail: hackathonsTable.thumbnail,
      },
    })
    .from(judgesTable)
    .innerJoin(hackathonsTable, eq(judgesTable.hackathonId, hackathonsTable.id))
    .where(eq(judgesTable.userId, judgeId));

  res.json(
    new ApiResponse(
      200,
      assignments,
      "Judge assignments retrieved successfully"
    )
  );
});

// Get projects to evaluate for a hackathon (judge only)
export const getProjectsToEvaluate = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const judgeId = req.user.id;

  // Verify judge is assigned to this hackathon
  const judgeAssignment = await db
    .select()
    .from(judgesTable)
    .where(
      and(
        eq(judgesTable.hackathonId, hackathonId),
        eq(judgesTable.userId, judgeId)
      )
    )
    .limit(1);

  if (!judgeAssignment.length) {
    throw new ApiError(
      403,
      "You are not assigned as a judge for this hackathon"
    );
  }

  // Get submitted projects for this hackathon
  const projects = await db
    .select({
      id: projectsTable.id,
      title: projectsTable.title,
      description: projectsTable.description,
      tags: projectsTable.tags,
      demoUrl: projectsTable.demoUrl,
      videoUrl: projectsTable.videoUrl,
      repositoryUrl: projectsTable.repositoryUrl,
      submittedAt: projectsTable.submittedAt,
      images: projectsTable.images,
      creator: {
        id: usersTable.id,
        fullName: usersTable.fullName,
        avatarUrl: usersTable.avatarUrl,
      },
      team: {
        id: teamsTable.id,
        name: teamsTable.teamName,
      },
    })
    .from(projectsTable)
    .leftJoin(usersTable, eq(projectsTable.creatorId, usersTable.id))
    .leftJoin(teamsTable, eq(projectsTable.teamId, teamsTable.id))
    .where(
      and(
        eq(projectsTable.hackathonId, hackathonId),
        eq(projectsTable.submissionStatus, "submitted")
      )
    );

  res.json(
    new ApiResponse(
      200,
      projects,
      "Projects to evaluate retrieved successfully"
    )
  );
});

// Submit project evaluation/score
export const evaluateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { scores, feedback, overallScore } = req.body;
  const judgeId = req.user.id;

  // Get project details and verify it exists
  const project = await db
    .select({
      id: projectsTable.id,
      hackathonId: projectsTable.hackathonId,
      submissionStatus: projectsTable.submissionStatus,
    })
    .from(projectsTable)
    .where(eq(projectsTable.id, projectId))
    .limit(1);

  if (!project.length) {
    throw new ApiError(404, "Project not found");
  }

  if (project[0].submissionStatus !== "submitted") {
    throw new ApiError(400, "Can only evaluate submitted projects");
  }

  // Verify judge is assigned to this hackathon
  const judgeAssignment = await db
    .select()
    .from(judgesTable)
    .where(
      and(
        eq(judgesTable.hackathonId, project[0].hackathonId),
        eq(judgesTable.userId, judgeId)
      )
    )
    .limit(1);

  if (!judgeAssignment.length) {
    throw new ApiError(
      403,
      "You are not assigned as a judge for this hackathon"
    );
  }

  // Insert or update evaluation
  const [evaluation] = await db
    .insert(projectEvaluationsTable)
    .values({
      projectId,
      judgeId,
      scores, // JSON object with criteria scores
      feedback,
      overallScore,
    })
    .onConflictDoUpdate({
      target: [
        projectEvaluationsTable.projectId,
        projectEvaluationsTable.judgeId,
      ],
      set: {
        scores,
        feedback,
        overallScore,
        updatedAt: new Date(),
      },
    })
    .returning();

  // Update project status to "judged" if all judges have evaluated
  // You might want to implement logic to check if all judges have evaluated

  res.json(
    new ApiResponse(
      200,
      evaluation,
      "Project evaluation submitted successfully"
    )
  );
});

// Get evaluation results for a hackathon (organizer only)
export const getEvaluationResults = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const organizerId = req.user.id;

  // Verify organizer owns this hackathon
  const hackathon = await db
    .select()
    .from(hackathonsTable)
    .where(
      and(
        eq(hackathonsTable.id, hackathonId),
        eq(hackathonsTable.createdBy, organizerId)
      )
    )
    .limit(1);

  if (!hackathon.length) {
    throw new ApiError(404, "Hackathon not found or unauthorized");
  }

  // Get all evaluations for projects in this hackathon
  const evaluations = await db
    .select({
      projectId: projectEvaluationsTable.projectId,
      projectTitle: projectsTable.title,
      judgeId: projectEvaluationsTable.judgeId,
      judgeName: usersTable.fullName,
      scores: projectEvaluationsTable.scores,
      feedback: projectEvaluationsTable.feedback,
      overallScore: projectEvaluationsTable.overallScore,
      evaluatedAt: projectEvaluationsTable.createdAt,
    })
    .from(projectEvaluationsTable)
    .innerJoin(
      projectsTable,
      eq(projectEvaluationsTable.projectId, projectsTable.id)
    )
    .innerJoin(usersTable, eq(projectEvaluationsTable.judgeId, usersTable.id))
    .where(eq(projectsTable.hackathonId, hackathonId));

  res.json(
    new ApiResponse(
      200,
      evaluations,
      "Evaluation results retrieved successfully"
    )
  );
});

// Remove judge from hackathon (organizer only)
export const removeJudge = asyncHandler(async (req, res) => {
  const { hackathonId, judgeId } = req.params;
  const organizerId = req.user.id;

  // Verify organizer owns this hackathon
  const hackathon = await db
    .select()
    .from(hackathonsTable)
    .where(
      and(
        eq(hackathonsTable.id, hackathonId),
        eq(hackathonsTable.createdBy, organizerId)
      )
    )
    .limit(1);

  if (!hackathon.length) {
    throw new ApiError(404, "Hackathon not found or unauthorized");
  }

  await db
    .delete(judgesTable)
    .where(
      and(eq(judgesTable.hackathonId, hackathonId), eq(judgesTable.id, judgeId))
    );

  res.json(new ApiResponse(200, {}, "Judge removed successfully"));
});
