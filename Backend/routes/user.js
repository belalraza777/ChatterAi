import express from 'express';
const router = express.Router();

import { wrapAsync } from "../util/wrapAsync.js";
import { validateUser } from "../util/joiValidation.js";
import { loginUser, signupUser, logoutUser,checkUserLogin } from "../controllers/userController.js";

// Routes
router.post("/login", wrapAsync(loginUser));
router.post("/signup", validateUser, wrapAsync(signupUser));
router.get("/logout", logoutUser);
router.get("/check", checkUserLogin);

export default router;
