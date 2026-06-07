import { Router } from "express";
import { ApplicationController } from "../controllers/application.controller.js";
import { validate } from "../middleware/validation.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { CreateApplicationSchema, UserRole } from "shared";

const router = Router();
const controller = new ApplicationController();

router.post(
  "/",
  authenticate,
  authorize([UserRole.SEEKER]),
  validate(CreateApplicationSchema),
  controller.apply
);

router.get("/", authenticate, controller.getApplications);

router.patch(
  "/:id/status",
  authenticate,
  authorize([UserRole.EMPLOYER, UserRole.ADMIN]),
  controller.updateStatus
);

export default router;
