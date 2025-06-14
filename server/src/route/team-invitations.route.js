import { Router } from "express";
import {
  sendTeamInvitation,
  getMyInvitations,
  getTeamInvitations,
  acceptInvitation,
  declineInvitation,
  cancelInvitation,
} from "../controller/team-invitations.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import { inviteUserSchema } from "../validators/team-invitations.validator.js";

const router = Router();

// Send invitation to user
router.post(
  "/:teamId/invite",
  verifyJWT,
  validate(inviteUserSchema),
  sendTeamInvitation
);

// Get invitations for current user
router.get("/my-invitations", verifyJWT, getMyInvitations);

// Get all invitations for a team (team leaders only)
router.get("/:teamId/invitations", verifyJWT, getTeamInvitations);

// Accept invitation
router.put("/invitations/:invitationId/accept", verifyJWT, acceptInvitation);

// Decline invitation
router.put("/invitations/:invitationId/decline", verifyJWT, declineInvitation);

// Cancel invitation (team leaders only)
router.delete("/invitations/:invitationId/cancel", verifyJWT, cancelInvitation);

export default router;
