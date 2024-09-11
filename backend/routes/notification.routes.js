import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { deleteNotifications, getNotifications } from "../controllers/notification.controllers.js";
const router = express.Router();

router.get("/", protectedRoute, getNotifications);
router.get("/", protectedRoute, deleteNotifications);

export default router;