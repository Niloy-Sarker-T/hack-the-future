import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { loginSchema, registerSchema } from "../validators/users.validator.js";
import { login, logout, register } from "../controller/auth.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", verifyJWT, logout);

export default router;
