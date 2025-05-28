import { Router } from "express";
import {
  createTeam,
  getTeamById,
  joinTeam,
  leaveTeam,
  removeMember,
  transferLeadership,
  updateTeamInfo,
  getTeamsByHackathon,
  getUserTeams,
} from "../controller/teams.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  createTeamSchema,
  updateTeamSchema,
} from "../validators/teams.validator.js";

const router = Router();

// Team CRUD operations
router.post("/", verifyJWT, validate(createTeamSchema), createTeam);
router.get("/:teamId", getTeamById);
router.put("/:teamId", verifyJWT, validate(updateTeamSchema), updateTeamInfo);

// Team membership operations
router.post("/:teamId/join", verifyJWT, joinTeam);
router.delete("/:teamId/leave", verifyJWT, leaveTeam);
router.delete("/:teamId/members/:userId", verifyJWT, removeMember);
router.put("/:teamId/transfer/:userId", verifyJWT, transferLeadership);

// Team discovery
router.get("/hackathon/:hackathonId", getTeamsByHackathon);
router.get("/user/my-teams", verifyJWT, getUserTeams);

export default router;
