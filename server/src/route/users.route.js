import { Router } from "express";
import {
  uploadProfileImage,
  updateUserProfile,
  getUserProfileByUsername,
  getUserProfile,
  updateUserRole,
} from "../controller/users.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  updateUserProfileSchema,
  updateUserRoleSchema,
  uploadProfileImageSchema,
} from "../validators/users.validator.js";

const router = Router();

// Get user profile by username
// /api/users?username=someusername
router.get("/", getUserProfileByUsername);

router.put("/role", verifyJWT, validate(updateUserRoleSchema), updateUserRole);

// Get user profile by ID
router.get("/:userId", getUserProfile);

// Update user profile (authenticated)
router.put(
  "/:userId",
  verifyJWT,
  validate(updateUserProfileSchema),
  updateUserProfile
);

// Upload profile image (authenticated)
router.post(
  "/:userId/avatar",
  verifyJWT,
  validate(uploadProfileImageSchema),
  upload.single("image"),
  uploadProfileImage
);

// // Get user projects
// router.get("/:userId/projects", getUserProjects);
router.get("/:userId/projects", (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
});

// // Get user hackathons
// router.get("/:userId/hackathons", getUserHackathons);
router.get("/:userId/hackathons", (_, res) => {
  res.status(501).json({ message: "Not implemented yet" });
});

// // Get user achievements
// router.get("/:userId/achievements", getUserAchievements);
router.get("/:userId/achievements", (_, res) => {
  res.status(501).json({ message: "Not implemented yet" });
});

export default router;
