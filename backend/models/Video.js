import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true
    },
    thumbnailUrl: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: "All"
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    // one-vote-per-user: store which users liked/disliked
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
