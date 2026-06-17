import { Router } from "express";
import { ApplicationController } from "../controllers/application.controller.js";
import { validate } from "../middleware/validation.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { CreateApplicationSchema, UserRole } from "shared";

const router = Router();
const controller = new ApplicationController();

// Seeker: submit a proposal
router.post(
  "/",
  authenticate,
  authorize([UserRole.SEEKER]),
  validate(CreateApplicationSchema),
  controller.apply
);

// Any authenticated user: list applications (role-scoped inside controller)
router.get("/", authenticate, controller.getApplications);

// Employer/Admin: move an application through the hiring pipeline
router.patch(
  "/:id/status",
  authenticate,
  authorize([UserRole.EMPLOYER, UserRole.ADMIN]),
  controller.updateStatus
);

// Seeker: withdraw an application (Applied or Reviewed only)
router.patch(
  "/:id/withdraw",
  authenticate,
  authorize([UserRole.SEEKER]),
  controller.withdraw
);

// Seeker: accept or decline a job offer (when status = Accepted)
router.patch(
  "/:id/offer-response",
  authenticate,
  authorize([UserRole.SEEKER]),
  controller.offerResponse
);

export default router;
