import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validation.js";
import { authenticate } from "../middleware/auth.js";
import { RegisterSchema, LoginSchema, UpdateProfileSchema } from "shared";

const router = Router();
const controller = new AuthController();

router.post("/register", validate(RegisterSchema), controller.register);
router.post("/login", validate(LoginSchema), controller.login);
router.post("/refresh", controller.refresh);
router.get("/profile", authenticate, controller.getProfile);
router.put("/profile", authenticate, validate(UpdateProfileSchema), controller.updateProfile);

export default router;
