import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { commentOnPost, createPost, deletePost, likesUnlikeOnPost } from "../controllers/post.controllers.js";
const router = express.Router();

router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likesUnlikeOnPost);
router.post("/comment/:id", protectedRoute, commentOnPost);
router.delete("/delete/:id", protectedRoute, deletePost);

export default router;