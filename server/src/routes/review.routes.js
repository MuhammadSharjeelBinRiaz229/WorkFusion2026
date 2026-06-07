import { Router } from "express";
import { ReviewController } from "../controllers/review.controller.js";
import { validate } from "../middleware/validation.js";
import { authenticate } from "../middleware/auth.js";
import { CreateReviewSchema } from "shared";

const router = Router();
const controller = new ReviewController();

router.post("/", authenticate, validate(CreateReviewSchema), controller.createReview);
router.get("/user/:userId", controller.getReviews);

export default router;
