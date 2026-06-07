import { Router } from "express";
import { JobController } from "../controllers/job.controller.js";
import { validate } from "../middleware/validation.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { CreateJobSchema, UpdateJobSchema, UserRole } from "shared";

const router = Router();
const controller = new JobController();

// AI recommendations (needs to be above /:id to prevent parameter conflict)
router.get(
  "/recommendations",
  authenticate,
  authorize([UserRole.SEEKER, UserRole.ADMIN]),
  controller.getRecommendedJobs
);

router.get(
  "/recommendations/candidates/:jobId",
  authenticate,
  authorize([UserRole.EMPLOYER, UserRole.ADMIN]),
  controller.getRecommendedCandidates
);

// Standard job CRUD
router.post(
  "/",
  authenticate,
  authorize([UserRole.EMPLOYER, UserRole.ADMIN]),
  validate(CreateJobSchema),
  controller.createJob
);

router.get("/", controller.getJobs);
router.get("/:id", controller.getJobById);

router.put(
  "/:id",
  authenticate,
  authorize([UserRole.EMPLOYER, UserRole.ADMIN]),
  validate(UpdateJobSchema),
  controller.updateJob
);

router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.EMPLOYER, UserRole.ADMIN]),
  controller.deleteJob
);

export default router;
