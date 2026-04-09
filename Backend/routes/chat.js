import express from 'express';
const router = express.Router();
import { wrapAsync } from "../util/wrapAsync.js";
import { verifyAuth } from "../util/verfiyAuth.js";
import {validateMessage,validateTitle} from "../util/joiValidation.js";
import { uploadChatImage } from "../util/chatUpload.js";
import {getAllThreads,createThread,getThread,sendMessage,deleteThread} from "../controllers/chatController.js";

// Routes
router.get("/", verifyAuth, wrapAsync(getAllThreads));
router.post("/new", verifyAuth, validateTitle, wrapAsync(createThread));
router.get("/:threadId", verifyAuth, wrapAsync(getThread));
// Parse upload first so validation can inspect both text fields and file.
router.post("/:threadId/message", verifyAuth, uploadChatImage, validateMessage, wrapAsync(sendMessage));
router.delete("/:threadId", verifyAuth, wrapAsync(deleteThread));

export default router;
