import { Router } from "express";
import { uploadProfileImage } from "../controller/auth.controller";
import verifyJWT from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";
import { validate } from "../middleware/validator.middleware";
import { updateUserProfile } from "../controller/users.controller";

const router = Router();

router.patch(
  "/profile-image",
  verifyJWT,
  validate("uploadProfileImageSchema"),
  upload.single("image"),
  uploadProfileImage
);

router.patch(
  "/profile",
  verifyJWT,
  validate("updateUserProfileSchema"),
  updateUserProfile
);

export default router;
