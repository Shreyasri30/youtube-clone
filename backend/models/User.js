import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    },
    // Channels this user owns
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
      }
    ],
    // Channels this user is subscribed to
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
      }
    ]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
