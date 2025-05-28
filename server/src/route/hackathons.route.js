import { Router } from "express";
import {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  joinHackathon,
  getHackathonParticipants,
  getUpcomingHackathons,
} from "../controller/hackathons.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  createHackathonSchema,
  joinHackathonSchema,
  updateHackathonSchema,
} from "../validators/hackathons.validator.js";

const router = Router();
// Create a new hackathon
router.post("/", verifyJWT, validate(createHackathonSchema), createHackathon);

// Get all hackathons
router.get("/", getAllHackathons);

// Get upcoming hackathons
router.get("/upcoming", getUpcomingHackathons);

// Get a hackathon by ID
router.get("/:hackathonId", getHackathonById);

// Update a hackathon by ID
router.put(
  "/:hackathonId",
  verifyJWT,
  validate(updateHackathonSchema),
  updateHackathon
);

// Delete a hackathon by ID
router.delete("/:hackathonId", verifyJWT, deleteHackathon);

// Join a hackathon
router.post(
  "/:hackathonId/join",
  verifyJWT,
  validate(joinHackathonSchema),
  joinHackathon
);

// Get participants of a hackathon
router.get("/:hackathonId/participants", getHackathonParticipants);

export default router;
