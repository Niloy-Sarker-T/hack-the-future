import { Router } from "express";
import {
  assignJudges,
  getHackathonJudges,
  getMyJudgeAssignments,
  getProjectsToEvaluate,
  evaluateProject,
  getEvaluationResults,
  removeJudge,
} from "../controller/judges.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  assignJudgesSchema,
  evaluateProjectSchema,
} from "../validators/judges.validator.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Organizer routes - assign and manage judges
router.post(
  "/hackathons/:hackathonId/judges",
  validate(assignJudgesSchema),
  assignJudges
);
router.get("/hackathons/:hackathonId/judges", getHackathonJudges);
router.delete("/hackathons/:hackathonId/judges/:judgeId", removeJudge);

// Judge routes - view assignments and evaluate projects
router.get("/my-assignments", getMyJudgeAssignments);
router.get("/hackathons/:hackathonId/projects", getProjectsToEvaluate);
router.post(
  "/projects/:projectId/evaluate",
  validate(evaluateProjectSchema),
  evaluateProject
);

// Organizer routes - view evaluation results
router.get("/hackathons/:hackathonId/evaluations", getEvaluationResults);

export default router;
