import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    const channel = await Channel.create({
      channelName,
      description: description || "",
      channelBanner: channelBanner || "",
      owner: req.user.id
    });

    // Also push this channel into user's channels array
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { channels: channel._id }
    });

    res.status(201).json({
      message: "Channel created successfully",
      channel
    });
  } catch (error) {
    console.error("Create channel error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.user.id });
    res.json(channels);
  } catch (error) {
    console.error("Get my channels error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChannelById = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findById(id).populate("videos");
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.json(channel);
  } catch (error) {
    console.error("Get channel error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* TOGGLE SUBSCRIBE / UNSUBSCRIBE CHANNEL (one subscription per user per channel) */
export const toggleSubscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    const channelId = req.params.id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already subscribed
    const idx = user.subscriptions.findIndex(
      (c) => String(c) === String(channelId)
    );

    let subscribed;

    if (idx !== -1) {
      // Unsubscribe
      user.subscriptions.splice(idx, 1);
      if (channel.subscribers > 0) {
        channel.subscribers -= 1;
      }
      subscribed = false;
    } else {
      // Subscribe
      user.subscriptions.push(channelId);
      channel.subscribers += 1;
      subscribed = true;
    }

    await user.save();
    await channel.save();

    return res.json({
      message: subscribed ? "Subscribed to channel" : "Unsubscribed from channel",
      subscribed,
      subscribersCount: channel.subscribers
    });
  } catch (error) {
    console.error("Toggle subscribe error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
