// VideoCard: Displays each video in the Home / Search / Channel pages.
// Provides YouTube-style card: thumbnail, title, channel name, views.
// Navigates to /video/:id when clicked.

import { useNavigate } from "react-router-dom";

/**
 * Format view counts similar to YouTube.
 */
function formatViews(views) {
  if (!views || isNaN(views)) return "0 views";

  if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M views";
  if (views >= 1_000) return (views / 1_000).toFixed(1) + "K views";

  return views + " views";
}

function VideoCard({ video }) {
  const navigate = useNavigate();

  return (
    <div className="video-card" onClick={() => navigate(`/video/${video._id}`)}>
      {/* Thumbnail */}
      <div className="thumbnail-wrapper">
        <img
          src={video.thumbnailUrl || "https://via.placeholder.com/320x180"}
          alt={video.title}
        />
      </div>

      {/* Details */}
      <div className="video-info">
        <h4 className="video-title">{video.title}</h4>

        <p className="channel-name">
          {video.channel?.channelName || "Unknown Channel"}
        </p>

        <p className="views">{formatViews(video.views)}</p>
      </div>
    </div>
  );
}

export default VideoCard;
