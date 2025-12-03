// VideoPlayer: Plays a single video and shows channel info,
// like/dislike/share/download actions, comments with edit/delete, and recommended videos on the right.

import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

/* ===== ICONS ===== */

const ThumbUpIcon = () => (
  <svg className="icon" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M9 21h9a2 2 0 0 0 2-2v-7.5a1.5 1.5 0 0 0-1.5-1.5H14l1-4.1V5a2 2 0 0 0-2-2h-.2a1 1 0 0 0-.9.6L8 9v12zM7 21H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3v11z"
    />
  </svg>
);

const ThumbDownIcon = () => (
  <svg className="icon" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M15 3H6a2 2 0 0 0-2 2v7.5A1.5 1.5 0 0 0 5.5 14H10l-1 4.1V19a2 2 0 0 0 2 2h.2a1 1 0 0 0 .9-.6L16 15V3zM17 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3V3z"
    />
  </svg>
);

const UserCircleIcon = () => (
  <svg className="icon" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3.003 3.003 0 0 1 3-3zm0 14.2A7.2 7.2 0 0 1 6.2 14h11.6A7.2 7.2 0 0 1 12 19.2z"
    />
  </svg>
);

const ShareIcon = () => (
  <svg className="icon" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.27 3.27 0 0 0 0-1.39l7-4.11A3 3 0 1 0 14 5a2.9 2.9 0 0 0 .06.6l-7 4.11a3 3 0 1 0 0 4.58l7.05 4.14A2.9 2.9 0 0 0 14 19a3 3 0 1 0 3.99-2.92z"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg className="icon" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M5 20h14v-2H5v2zm7-18-5 5h3v6h4V7h3l-5-5z"
    />
  </svg>
);

const MoreVerticalIcon = () => (
  <svg className="icon" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 8a2 2 0 1 0-2-2 2 2 0 0 0 2 2zm0 2a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm0 6a2 2 0 1 0 2 2 2 2 0 0 0-2-2z"
    />
  </svg>
);

function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext) || {};

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [openCommentMenuId, setOpenCommentMenuId] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false); // simple local toggle

  // Auth header for all protected routes
  const authConfig = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  // ===== API LOADERS =====

  const fetchVideo = async () => {
    try {
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${id}`);
      setComments(res.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchRecommended = async () => {
    try {
      const res = await api.get("/videos");
      const list = (res.data || []).filter((v) => v._id !== id).slice(0, 10);
      setRecommended(list);
    } catch (error) {
      console.error("Error fetching recommended videos:", error);
    }
  };

  useEffect(() => {
    setVideo(null);
    setComments([]);
    setEditingCommentId(null);
    setEditingText("");
    setOpenCommentMenuId(null);

    fetchVideo();
    fetchComments();
    fetchRecommended();
  }, [id]);

  // ===== ACTION HANDLERS =====

  const requireLogin = (message) => {
    if (!user) {
      alert(message || "Please sign in to perform this action.");
      return false;
    }
    return true;
  };

  // Like / Dislike toggle with protected PUT endpoints
  const handleLike = async () => {
    if (!requireLogin("Please sign in to like videos.")) return;
    try {
      await api.put(`/videos/${id}/like`, {}, authConfig);
      fetchVideo();
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleDislike = async () => {
    if (!requireLogin("Please sign in to dislike videos.")) return;
    try {
      await api.put(`/videos/${id}/dislike`, {}, authConfig);
      fetchVideo();
    } catch (error) {
      console.error("Error disliking video:", error);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ url, title: video?.title || "Video" });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Video link copied to clipboard.");
      } else {
        alert("Share is not supported in this browser.");
      }
    } catch (error) {
      console.error("Error sharing video:", error);
    }
  };

  const handleDownload = () => {
    // Dummy behavior for clone
    alert("Download feature is simulated in this YouTube clone.");
  };

  const handleSubscribe = async () => {
    if (!requireLogin("Please sign in to subscribe.")) return;

    const channelId = video?.channel?._id;
    if (!channelId) {
      console.warn("No channel id available for subscribe.");
      return;
    }

    try {
      const res = await api.post(
        `/channels/${channelId}/subscribe`,
        {},
        authConfig
      );
      if (typeof res.data.subscribed === "boolean") {
        setIsSubscribed(res.data.subscribed);
      } else {
        setIsSubscribed((prev) => !prev);
      }
    } catch (error) {
      console.error("Error subscribing to channel:", error);
    }
  };

  // ===== COMMENT HANDLERS =====

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!requireLogin("Please sign in to comment.")) return;
    if (!newCommentText.trim()) return;

    try {
      await api.post(
        `/comments/${id}`,
        { text: newCommentText.trim() },
        authConfig
      );
      setNewCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
    setOpenCommentMenuId(null);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingText.trim()) return;
    try {
      await api.put(
        `/comments/update/${commentId}`,
        { text: editingText.trim() },
        authConfig
      );
      setEditingCommentId(null);
      setEditingText("");
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/delete/${commentId}`, authConfig);
      setOpenCommentMenuId(null);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // ===== RENDER =====

  if (!video) {
    return (
      <div className="app-layout">
        <Header
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="main-area">
          <Sidebar isOpen={isSidebarOpen} />
          <main className="content">
            <p className="info-text">Loading video...</p>
          </main>
        </div>
      </div>
    );
  }

  // count of likes and dislikes
  const likeCount = Array.isArray(video.likes)
    ? video.likes.length
    : Number(video.likes) || 0;

  const dislikeCount = Array.isArray(video.dislikes)
    ? video.dislikes.length
    : Number(video.dislikes) || 0;

  return (
    <div className="app-layout">
      <Header
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="main-area">
        <Sidebar isOpen={isSidebarOpen} />

        <main className="content video-player-page">
          <div className="video-player-layout">
            {/* LEFT SIDE: main video and comments */}
            <section className="video-main">
              <div className="video-player-wrapper">
                <video
                  src={video.videoUrl}
                  controls
                  autoPlay
                  poster={video.thumbnailUrl}
                />
              </div>

              <h1 className="video-title">{video.title}</h1>

              <div className="video-meta-row">
                {/* Channel section */}
                <div className="channel-row">
                  <div className="avatar-circle">
                    <UserCircleIcon />
                  </div>

                  <div>
                    <div className="channel-name">
                      {video.channel?.channelName || "Channel"}
                    </div>
                    <div className="channel-subs">
                      {video.views || 0} views
                    </div>
                  </div>

                  <button
                    className="subscribe-button"
                    onClick={handleSubscribe}
                  >
                    {isSubscribed ? "Unsubscribe" : "Subscribe"}
                  </button>
                </div>

                {/* Right side actions: like/dislike/share/download */}
                <div className="video-actions-right">
                  <button className="action-button" onClick={handleLike}>
                    <ThumbUpIcon />
                    <span>{likeCount}</span>
                  </button>
                  <button className="action-button" onClick={handleDislike}>
                    <ThumbDownIcon />
                    <span>{dislikeCount}</span>
                  </button>
                  <button className="action-button" onClick={handleShare}>
                    <ShareIcon />
                    <span>Share</span>
                  </button>
                  <button className="action-button" onClick={handleDownload}>
                    <DownloadIcon />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="video-description-box">
                <p>{video.description || "No description."}</p>
              </div>

              {/* COMMENTS */}
              <section className="comments-section">
                <h3 className="comments-header">
                  {comments.length} comments
                </h3>

                {user && (
                  <form className="comment-form" onSubmit={handleAddComment}>
                    <div className="avatar-circle small">
                      <UserCircleIcon />
                    </div>

                    <div className="comment-input-wrapper">
                      <input
                        type="text"
                        placeholder="Add a public comment..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                      />

                      <div className="comment-actions-row">
                        <button
                          type="button"
                          className="comment-cancel"
                          onClick={() => setNewCommentText("")}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="comment-submit"
                          disabled={!newCommentText.trim()}
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="comments-list">
                  {comments.map((comment) => (
                    <div key={comment._id} className="comment-item">
                      <div className="avatar-circle small">
                        <UserCircleIcon />
                      </div>

                      <div className="comment-body">
                        <div className="comment-header-row">
                          <span className="comment-author">
                            {comment.user?.username || "User"}
                          </span>
                          <span className="comment-time">
                            {new Date(
                              comment.createdAt
                            ).toLocaleDateString()}
                          </span>

                          {/* 3-dot menu for comment owner */}
                          {user &&
                            comment.user &&
                            user.id === comment.user._id && (
                              <div className="comment-menu-wrapper">
                                <button
                                  type="button"
                                  className="comment-menu-button"
                                  onClick={() =>
                                    setOpenCommentMenuId(
                                      openCommentMenuId === comment._id
                                        ? null
                                        : comment._id
                                    )
                                  }
                                >
                                  <MoreVerticalIcon />
                                </button>

                                {openCommentMenuId === comment._id && (
                                  <div className="comment-dropdown">
                                    <button
                                      type="button"
                                      onClick={() => startEdit(comment)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteComment(comment._id)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>

                        {editingCommentId === comment._id ? (
                          <>
                            <input
                              className="comment-edit-input"
                              value={editingText}
                              onChange={(e) =>
                                setEditingText(e.target.value)
                              }
                            />
                            <div className="comment-actions-row">
                              <button
                                className="comment-cancel"
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditingText("");
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="comment-submit"
                                onClick={() =>
                                  handleUpdateComment(comment._id)
                                }
                              >
                                Save
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="comment-text">{comment.text}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <p className="no-comments-text">Be the first to comment.</p>
                  )}
                </div>
              </section>
            </section>

            {/* RIGHT SIDE PANEL: recommended videos */}
            <aside className="video-side-panel">
              <h3 className="side-title">Up next</h3>
              {recommended.map((rv) => (
                <div
                  key={rv._id}
                  className="recommended-card"
                  onClick={() => navigate(`/video/${rv._id}`)}
                >
                  <img
                    src={rv.thumbnailUrl}
                    alt={rv.title}
                  />
                  <div className="recommended-info">
                    <h4>{rv.title}</h4>
                    <p>{rv.channel?.channelName || "Channel"}</p>
                    <span>{rv.views || 0} views</span>
                  </div>
                </div>
              ))}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default VideoPlayer;
