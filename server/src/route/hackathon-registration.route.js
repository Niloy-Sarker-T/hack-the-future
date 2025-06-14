import { Router } from "express";
import {
  registerForHackathon,
  getMyRegistration,
  withdrawRegistration,
  updateRegistration,
  getHackathonRegistrations,
  getAvailableParticipants,
} from "../controller/hackathon-registration.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  registrationSchema,
  getRegistrationsQuerySchema,
} from "../validators/hackathon-registration.validator.js";

const router = Router();

// Register for hackathon (solo or team)
router.post(
  "/:hackathonId/register",
  verifyJWT,
  validate(registrationSchema),
  registerForHackathon
);

// Get my registration for a specific hackathon
router.get("/:hackathonId/my-registration", verifyJWT, getMyRegistration);

// Update registration (change team, etc.)
router.put(
  "/:hackathonId/registration",
  verifyJWT,
  validate(registrationSchema),
  updateRegistration
);

// Withdraw from hackathon
router.delete("/:hackathonId/registration", verifyJWT, withdrawRegistration);

// Get all registrations for a hackathon (organizers only)
router.get(
  "/:hackathonId/registrations",
  verifyJWT,
  validate(getRegistrationsQuerySchema, "query"), // ADD "query" parameter
  getHackathonRegistrations
);

// Get available participants (solo participants without teams) for team discovery
router.get("/:hackathonId/available-participants", getAvailableParticipants);

export default router;
