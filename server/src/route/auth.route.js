import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { loginSchema, registerSchema } from "../validators/users.validator.js";
import {
  login,
  logout,
  register,
  uploadProfileImage,
} from "../controller/auth.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", verifyJWT, logout);
router.post(
  "/profile-image",
  verifyJWT,
  upload.single("image"),
  uploadProfileImage
);

export default router;
