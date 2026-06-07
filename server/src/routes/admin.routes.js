import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { UserRole } from "shared";

const router = Router();
const controller = new AdminController();

// Admin-only dashboard controls
router.patch(
  "/users/:userId",
  authenticate,
  authorize([UserRole.ADMIN]),
  controller.moderateUser
);

router.patch(
  "/jobs/:jobId",
  authenticate,
  authorize([UserRole.ADMIN]),
  controller.moderateJob
);

router.get(
  "/analytics",
  authenticate,
  authorize([UserRole.ADMIN]),
  controller.getAnalytics
);

router.post(
  "/categories",
  authenticate,
  authorize([UserRole.ADMIN]),
  controller.createCategory
);

// Fetching categories is readable by all authenticated users
router.get("/categories", authenticate, controller.getCategories);

export default router;
