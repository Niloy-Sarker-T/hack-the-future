import { Router } from "express";
import {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  // joinHackathon, // DEPRECATE: Replace with registration system
  getHackathonParticipants,
  getUpcomingHackathons,
  getEndHackathons,
  getOngoingHackathons,
  uploadHackathonImage,
  getMyHackathonParticipation,
  // ADD these new functions
  // getHackathonTeams,
  // getHackathonStats,
} from "../controller/hackathons.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  createHackathonSchema,
  // joinHackathonSchema, // DEPRECATE
  updateHackathonSchema,
} from "../validators/hackathons.validator.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

// Create a new hackathon
router.post("/", verifyJWT, validate(createHackathonSchema), createHackathon);

// Get all hackathons
router.get("/", getAllHackathons);

// Get upcoming hackathons
router.get("/upcoming", getUpcomingHackathons);

// Get ongoing hackathons
router.get("/ongoing", getOngoingHackathons);

// Get ended hackathons
router.get("/ended", getEndHackathons);

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

// DEPRECATE: Replace with registration system
// router.post("/:hackathonId/join", verifyJWT, validate(joinHackathonSchema), joinHackathon);

// Get participants of a hackathon
router.get("/:hackathonId/participants", getHackathonParticipants);
router.get(
  "/:hackathonId/participants/me",
  verifyJWT,
  getMyHackathonParticipation
);

// ADD: Get teams for a hackathon
// router.get("/:hackathonId/teams", getHackathonTeams);

// ADD: Get hackathon statistics (organizers only)
// router.get("/:hackathonId/stats", verifyJWT, getHackathonStats);

// Upload thumbnail or banner image
router.post(
  "/:hackathonId/upload-image",
  verifyJWT,
  upload.single("image"),
  uploadHackathonImage
);

export default router;
