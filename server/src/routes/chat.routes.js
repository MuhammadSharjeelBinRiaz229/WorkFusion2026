import { Router } from "express";
import { ChatController } from "../controllers/chat.controller.js";
import { validate } from "../middleware/validation.js";
import { authenticate } from "../middleware/auth.js";
import { CreateMessageSchema } from "shared";

const router = Router();
const controller = new ChatController();

router.get("/", authenticate, controller.getChats);
router.get("/:chatId/messages", authenticate, controller.getMessages);
router.post("/message", authenticate, validate(CreateMessageSchema), controller.sendMessage);

export default router;
