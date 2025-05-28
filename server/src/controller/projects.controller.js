import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { db } from "../db/db.config.js";
import { projectsTable, projectMatesTable } from "../db/schema/index.js";
import { eq, and } from "drizzle-orm";

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
