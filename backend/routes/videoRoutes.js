// Routes for all video-related operations.
// Includes: list, fetch single, create, update, delete, like/dislike, search.

import express from "express";
import {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  searchVideos
} from "../controllers/videoController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/videos
 * List all videos with optional ?search=&category=
 * Used by home page and channel page.
 */
router.get("/", getAllVideos);

/**
 * GET /api/videos/search?query=react
 * Full-text search endpoint for /search page.
 */
router.get("/search", searchVideos);

/**
 * GET /api/videos/:id
 * Fetch a single video (also increments views).
 */
router.get("/:id", getVideoById);

/**
 * POST /api/videos
 * Create new video (requires login).
 */
router.post("/", authMiddleware, createVideo);

/**
 * PUT /api/videos/:id
 * Update an existing video.
 */
router.put("/:id", authMiddleware, updateVideo);

/**
 * DELETE /api/videos/:id
 * Remove a video entirely.
 */
router.delete("/:id", authMiddleware, deleteVideo);

/**
 * PUT /api/videos/:id/like
 * Toggle like for current user.
 */
router.put("/:id/like", authMiddleware, likeVideo);

/**
 * PUT /api/videos/:id/dislike
 * Toggle dislike for current user.
 */
router.put("/:id/dislike", authMiddleware, dislikeVideo);

export default router;
