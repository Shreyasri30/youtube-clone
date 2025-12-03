// Routes for all comment-related operations.
// Includes: list by video, create, update, delete.

import express from "express";
import {
  addComment,
  getCommentsByVideo,
  updateComment,
  deleteComment
} from "../controllers/commentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/comments/:videoId
 * Fetch all comments under a specific video.
 * Public route.
 */
router.get("/:videoId", getCommentsByVideo);

/**
 * POST /api/comments/:videoId
 * Add a new comment to a video.
 * Requires authentication.
 */
router.post("/:videoId", authMiddleware, addComment);

/**
 * PUT /api/comments/update/:id
 * Update an existing comment.
 * Only the original author is allowed.
 */
router.put("/update/:id", authMiddleware, updateComment);

/**
 * DELETE /api/comments/delete/:id
 * Delete a comment.
 * Only the original author is allowed.
 */
router.delete("/delete/:id", authMiddleware, deleteComment);

export default router;
