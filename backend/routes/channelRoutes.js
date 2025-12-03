import express from "express";
import {
  createChannel,
  getMyChannels,
  getChannelById,
  toggleSubscribe
} from "../controllers/channelController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new channel (logged-in users only)
router.post("/", authMiddleware, createChannel);

// Subscribe / Unsubscribe to a channel
router.post("/:id/subscribe", authMiddleware, toggleSubscribe);

// Get channels owned by logged-in user
router.get("/me", authMiddleware, getMyChannels);

// Get channel by id (public)
router.get("/:id", getChannelById);

export default router;
