import { Router } from "express";
import {
  uploadProfileImage,
  updateUserProfile,
  getUserProfileByUsername,
  getUserProfile,
} from "../controller/users.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validator.middleware.js";

const router = Router();

// Get user profile by username
// /api/users?username=someusername
router.get("/", getUserProfileByUsername);

// Get user profile by ID
router.get("/:userId", getUserProfile);

// Update user profile (authenticated)
router.put(
  "/:userId",
  verifyJWT,
  validate("updateUserProfileSchema"),
  updateUserProfile
);

// Upload profile image (authenticated)
router.post(
  "/:userId/avatar",
  verifyJWT,
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
