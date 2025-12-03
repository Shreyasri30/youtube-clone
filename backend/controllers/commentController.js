// Controller for handling all comment-related operations:
// create, list by video, update own comment, delete own comment.

import Comment from "../models/Comment.js";

/**
 * Add a new comment under a specific video.
 * Route: POST /api/comments/:videoId
 * Auth required req.user.id contains the logged-in user's ID.
 */
export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    // Create the comment document
    const comment = await Comment.create({
      video: videoId,
      user: req.user.id,
      text: text.trim()
    });

    return res.status(201).json({
      message: "Comment added successfully",
      comment
    });
  } catch (error) {
    console.error("Add comment error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all comments for a video (sorted newest to oldest).
 * Route: GET /api/comments/:videoId
 */
export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ video: videoId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    return res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update an existing comment (only the author is allowed).
 * Route: PUT /api/comments/update/:id
 */
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Updated text cannot be empty." });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Authorization: user must own this comment
    if (String(comment.user) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this comment." });
    }

    comment.text = text.trim();
    await comment.save();

    return res.json({
      message: "Comment updated successfully",
      comment
    });
  } catch (error) {
    console.error("Update comment error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete an existing comment (only the author is allowed).
 * Route: DELETE /api/comments/delete/:id
 */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Authorization check
    if (String(comment.user) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this comment." });
    }

    await comment.deleteOne();

    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
