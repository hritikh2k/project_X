import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { commentOnPost, createPost, deletePost, getAllLikedPost, getAllPost, getFollowingPost, getUserPost, likesUnlikeOnPost } from "../controllers/post.controllers.js";
const router = express.Router();

router.get("/allpost", protectedRoute, getAllPost);
router.get("/likes/:id", protectedRoute, getAllLikedPost);
router.get("/following", protectedRoute, getFollowingPost);
router.get("/user/:username", protectedRoute, getUserPost);
router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likesUnlikeOnPost);
router.post("/comment/:id", protectedRoute, commentOnPost);
router.delete("/delete/:id", protectedRoute, deletePost);

export default router;