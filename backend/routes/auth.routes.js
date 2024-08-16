import express from "express";
import { login, logout, signup, getme } from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.get('/login', login)
router.get('/me', protectedRoute, getme)
router.get('/logout', logout)
router.get('/signup', signup)

export default router