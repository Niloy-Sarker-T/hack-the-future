import { Router } from "express";
import {
  createProject,
  getUserProjects,
  updateProject,
  deleteProject,
  getProjectById,
  createHackathonProject,
  submitProject,
  getHackathonProjects,
  getMyHackathonProjects,
  updateHackathonProject,
  withdrawSubmission,
} from "../controller/projects.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
  createHackathonProjectSchema,
} from "../validators/projects.validator.js";

const router = Router();

// EXISTING ROUTES
router.post("/", verifyJWT, validate(createProjectSchema), createProject);
router.get("/user/:userId", getUserProjects);
router.get("/:projectId", getProjectById);
router.put(
  "/:projectId",
  verifyJWT,
  validate(updateProjectSchema),
  updateProject
);
router.delete("/:projectId", verifyJWT, deleteProject);

// NEW HACKATHON ROUTES
router.post(
  "/hackathon",
  verifyJWT,
  validate(createHackathonProjectSchema),
  createHackathonProject
);
router.put("/:projectId/submit", verifyJWT, submitProject);
router.put("/:projectId/withdraw", verifyJWT, withdrawSubmission);
router.put(
  "/:projectId/hackathon",
  verifyJWT,
  validate(updateProjectSchema),
  updateHackathonProject
);
router.get("/hackathon/:hackathonId/all", getHackathonProjects);
router.get("/hackathon/:hackathonId/my", verifyJWT, getMyHackathonProjects);

export default router;
