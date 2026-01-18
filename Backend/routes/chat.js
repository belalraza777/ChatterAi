import express from 'express';
const router = express.Router();
import { wrapAsync } from "../util/wrapAsync.js";
import { verifyAuth } from "../util/verfiyAuth.js";
import {validateMessage,validateTitle} from "../util/joiValidation.js";
import {getAllThreads,createThread,getThread,sendMessage,deleteThread} from "../controllers/chatController.js";

// Routes
router.get("/", verifyAuth, wrapAsync(getAllThreads));
router.post("/new", verifyAuth, validateTitle, wrapAsync(createThread));
router.get("/:threadId", verifyAuth, wrapAsync(getThread));
router.post("/:threadId/message", verifyAuth, validateMessage, wrapAsync(sendMessage));
router.delete("/:threadId", verifyAuth, wrapAsync(deleteThread));

export default router;
