import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

/**
 * Create a new video under a channel.
 * Expects: title, videoUrl, channelId (required) and optional description, thumbnailUrl, category
 */
export const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category, channelId } =
      req.body;

    if (!title || !videoUrl || !channelId) {
      return res
        .status(400)
        .json({ message: "Title, video URL and channelId are required." });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      channel: channelId
    });

    // Maintain back-reference from channel to videos
    channel.videos.push(video._id);
    await channel.save();

    return res.status(201).json({
      message: "Video created successfully",
      video
    });
  } catch (error) {
    console.error("Create video error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * List videos with optional search and category filters.
 * Query params:
 *  - search: partial, case-insensitive match on title
 *  - category: exact match (ignored if "All" or empty)
 */
export const getVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search && search.trim() !== "") {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const videos = await Video.find(query).populate("channel", "channelName");
    res.json(videos);
  } catch (error) {
    console.error("Get videos error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllVideos = getVideos;

/**
 * Fetch a single video by id.
 * Also increments the view count by 1 when retrieved.
 */
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id).populate(
      "channel",
      "channelName"
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    // Increment views each time the video is fetched
    video.views = (video.views || 0) + 1;
    await video.save();

    res.json(video);
  } catch (error) {
    console.error("Get video by id error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update basic fields of a video document.
 */
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Video.findByIdAndUpdate(id, req.body, {
      new: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Video not found." });
    }

    res.json({
      message: "Video updated successfully",
      video: updated
    });
  } catch (error) {
    console.error("Update video error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a video and remove it from its channel's videos list.
 */
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    // Remove from the owning channel
    await Channel.findByIdAndUpdate(video.channel, {
      $pull: { videos: id }
    });

    await Video.findByIdAndDelete(id);

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete video error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Toggle like for a video for the current user.
 * - If already liked then remove like
 * - Otherwise, add like and remove dislike if present
 */
export const likeVideo = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { id } = req.params;
    const userId = req.user.id;

    const video = await Video.findById(id);

    // Standardized error response format
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    const likedIndex = video.likes.findIndex(
      (u) => String(u) === String(userId)
    );
    const dislikedIndex = video.dislikes.findIndex(
      (u) => String(u) === String(userId)
    );

    if (likedIndex !== -1) {
      // User already liked then toggle off
      video.likes.splice(likedIndex, 1);
    } else {
      // Add like, ensure it is not in dislikes
      video.likes.push(userId);
      if (dislikedIndex !== -1) {
        video.dislikes.splice(dislikedIndex, 1);
      }
    }

    await video.save();

    res.json({
      message: "Like status updated",
      likes: video.likes.length,
      dislikes: video.dislikes.length
    });
  } catch (error) {
    console.error("Like video error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Toggle dislike for a video for the current user.
 * - If already disliked then remove dislike
 * - Otherwise, add dislike and remove like if present
 */
export const dislikeVideo = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { id } = req.params;
    const userId = req.user.id;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const likedIndex = video.likes.findIndex(
      (u) => String(u) === String(userId)
    );
    const dislikedIndex = video.dislikes.findIndex(
      (u) => String(u) === String(userId)
    );

    if (dislikedIndex !== -1) {
      // User already disliked then toggle off
      video.dislikes.splice(dislikedIndex, 1);
    } else {
      // Add dislike, ensure it is not in likes
      video.dislikes.push(userId);
      if (likedIndex !== -1) {
        video.likes.splice(likedIndex, 1);
      }
    }

    await video.save();

    res.json({
      message: "Dislike status updated",
      likes: video.likes.length,
      dislikes: video.dislikes.length
    });
  } catch (error) {
    console.error("Dislike video error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Full-text style search by title, description or category.
 * Used by the /search page: /api/videos/search?query=...
 */
export const searchVideos = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.json([]);
    }

    const regex = new RegExp(query.trim(), "i");

    const videos = await Video.find({
      $or: [
        { title: regex },
        { description: regex },
        { category: regex }
      ]
    }).populate("channel", "channelName");

    res.json(videos);
  } catch (error) {
    console.error("Search videos error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
