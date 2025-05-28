import { Router } from "express";
import {
  createProject,
  getUserProjects,
  updateProject,
  deleteProject,
  getProjectById,
} from "../controller/projects.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/projects.validator.js";

const router = Router();

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

export default router;
