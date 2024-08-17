import express from "express";
import { login, logout, signup, getme } from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.get('/me', protectedRoute, getme);
router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', signup);

export default router