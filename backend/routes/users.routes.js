import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { getUserProfile, followUnfollow, getSuggestUsers, updateUserProfile } from "../controllers/users.controllers.js";

const router = express.Router();

router.get('/profile/:username', protectedRoute, getUserProfile);
router.get('/suggestion', protectedRoute, getSuggestUsers);
router.post('/follow/:id', protectedRoute, followUnfollow);
router.post('/profile/update', protectedRoute, updateUserProfile);

export default router;