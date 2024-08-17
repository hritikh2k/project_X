import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
const router = express.Router();

router.get('/profile/:username', protectedRoute, getUserProfile);
router.get('/profile/:suggestion', protectedRoute, getUserProfile);
router.post('/profile/:follow', protectedRoute, followUnfollow);
router.post('/profile/:update', protectedRoute, updateUserProfile);

export default router;