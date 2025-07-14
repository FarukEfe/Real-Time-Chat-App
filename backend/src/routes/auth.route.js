import express from "express";
import { login, logout, signup, update, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"; // Importing the protectRoute middleware to secure the update route

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
// We use protectRoute middleware to ensure that once the user is logged in, their updates can be validated just by checking JWT token (cookie).
router.put("/update", protectRoute, update) // Put method to update user information. protectRoute() is a wrapper function for update()

router.get("/check", protectRoute, checkAuth);

export default router;