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
router.post("/add-profile", authenticate, controller.addProfile);
router.post("/switch-role", authenticate, controller.switchRole);
router.post("/change-password", authenticate, controller.changePassword);
router.get("/talents", authenticate, controller.getTalents);

export default router;
