//User's channel logic
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

const DUMMY_HOME_VIDEOS = [
  {
    title: "Welcome to your channel!",
    thumbnailUrl:
      "https://i.ytimg.com/vi_webp/5qap5aO4i9A/maxresdefault.webp",
    views: "1 view",
    age: "just now"
  },
  {
    title: "Upload your first video!",
    thumbnailUrl:
      "https://i.ytimg.com/vi_webp/K4TOrB7at0Y/maxresdefault.webp",
    views: "0 views",
    age: "today"
  },
  {
    title: "Customize your channel.",
    thumbnailUrl:
      "https://i.ytimg.com/vi_webp/jfKfPfyJRdk/maxresdefault.webp",
    views: "2 views",
    age: "today"
  }
];

const initialForm = {
  title: "",
  description: "",
  videoUrl: "",
  thumbnailUrl: ""
};

// Same style as home page cards – 1.2K, 3.4M etc.
const formatViews = (views) => {
  if (views === undefined || views === null) return "";
  if (typeof views === "string") return views;

  const n = Number(views) || 0;
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M views`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K views`;
  }
  return `${n} views`;
};

function Channel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("Videos");

  const [showForm, setShowForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //YouTube-style sort for "Videos" tab
  const [sortOption, setSortOption] = useState("latest"); // latest | popular | oldest

  const authConfig = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  const fetchChannel = async () => {
    try {
      const res = await api.get(`/channels/${id}`);
      setChannel(res.data);
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error("Error fetching channel:", err);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingVideoId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingVideoId) {
        await api.put(`/videos/${editingVideoId}`, form, authConfig);
        setSuccess("Video updated!");
      } else {
        await api.post(
          "/videos",
          { ...form, channelId: id },
          authConfig
        );
        setSuccess("Video added!");
      }

      resetForm();
      fetchChannel();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed. Try again."
      );
    }
  };

  const handleAddClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditClick = (video) => {
    setForm({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl
    });
    setEditingVideoId(video._id);
    setShowForm(true);
  };

  const handleVideoOpen = (videoId) => navigate(`/video/${videoId}`);

  const channelHandle = channel?.channelName
    ? "@" + channel.channelName.toLowerCase().replace(/\s+/g, "")
    : "@channel";

  const avatarLetter = channel?.channelName
    ? channel.channelName.charAt(0).toUpperCase()
    : "C";

  // ---------- SORTED LIST FOR "VIDEOS" TAB ----------
  const sortedVideos = [...videos].sort((a, b) => {
    const viewsA = Number(a.views) || 0;
    const viewsB = Number(b.views) || 0;

    const dateA = a.uploadDate || a.createdAt;
    const dateB = b.uploadDate || b.createdAt;

    const timeA = dateA ? new Date(dateA).getTime() : 0;
    const timeB = dateB ? new Date(dateB).getTime() : 0;

    if (sortOption === "popular") {
      return viewsB - viewsA; // high views first
    }
    if (sortOption === "oldest") {
      return timeA - timeB; // oldest first
    }
    return timeB - timeA; // newest first
  });

  return (
    <div className="app-layout">
      <Header
        onToggleSidebar={() =>
          setIsSidebarOpen((prev) => !prev)
        }
        searchTerm=""
        setSearchTerm={() => {}}
        onSearch={() => {}}
      />

      <div className="main-area">
        <Sidebar isOpen={isSidebarOpen} />

        <main className="content channel-page">
          {!channel ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Banner */}
              <div className="channel-banner"></div>

              {/* Header */}
              <div className="channel-header-row">
                <div className="channel-avatar-large">
                  {avatarLetter}
                </div>

                <div className="channel-header-text">
                  <h2>{channel.channelName}</h2>
                  <p>{channelHandle}</p>
                  <p>
                    {channel.subscribers || 0} subscribers •{" "}
                    {videos.length} videos
                  </p>
                  {channel.description && (
                    <p>{channel.description}</p>
                  )}
                </div>

                <div className="channel-actions-row">
                  <button className="channel-actions-btn ghost">
                    Customize channel
                  </button>
                  <button
                    className="channel-actions-btn primary"
                    onClick={handleAddClick}
                  >
                    Add video
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="channel-tabs-row">
                {["Home", "Videos", "Playlists", "About"].map(
                  (tab) => (
                    <button
                      key={tab}
                      className={`channel-tab ${
                        activeTab === tab ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>

              {/* HOME TAB */}
              {activeTab === "Home" && (
                <section className="channel-videos">
                  <h3 className="section-title">Featured</h3>

                  <div className="channel-video-grid">
                    {(videos.length > 0
                      ? videos
                      : DUMMY_HOME_VIDEOS
                    ).map((v, i) => (
                      <div
                        key={v._id || i}
                        className="channel-video-card"
                        onClick={() =>
                          v._id && handleVideoOpen(v._id)
                        }
                      >
                        <div className="channel-video-thumb">
                          <img src={v.thumbnailUrl} alt={v.title} />
                        </div>
                        <div className="channel-video-body">
                          <h4>{v.title}</h4>
                          <p className="channel-video-meta">
                            {formatViews(v.views)}
                            {v.age
                              ? ` • ${v.age}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* VIDEOS TAB – with YouTube-style filters Latest / Popular / Oldest */}
              {activeTab === "Videos" && (
                <section className="channel-videos">
                  <h3 className="section-title">Videos</h3>

                  {/* Sort chips row, matching YouTube */}
                  <div className="channel-sort-row">
                    <button
                      className={`channel-sort-chip ${
                        sortOption === "latest" ? "active" : ""
                      }`}
                      onClick={() => setSortOption("latest")}
                    >
                      Latest
                    </button>
                    <button
                      className={`channel-sort-chip ${
                        sortOption === "popular" ? "active" : ""
                      }`}
                      onClick={() => setSortOption("popular")}
                    >
                      Popular
                    </button>
                    <button
                      className={`channel-sort-chip ${
                        sortOption === "oldest" ? "active" : ""
                      }`}
                      onClick={() => setSortOption("oldest")}
                    >
                      Oldest
                    </button>
                  </div>

                  {videos.length === 0 ? (
                    <p>No videos yet. Click "Add video".</p>
                  ) : (
                    <div className="channel-video-grid">
                      {sortedVideos.map((v) => (
                        <div
                          key={v._id}
                          className="channel-video-card"
                        >
                          <div
                            className="channel-video-thumb"
                            onClick={() =>
                              handleVideoOpen(v._id)
                            }
                          >
                            <img
                              src={v.thumbnailUrl}
                              alt={v.title}
                            />
                          </div>
                          <div className="channel-video-body">
                            <h4
                              onClick={() =>
                                handleVideoOpen(v._id)
                              }
                            >
                              {v.title}
                            </h4>
                            <p className="channel-video-meta">
                              {formatViews(v.views)}{" "}
                              {v.createdAt &&
                                `• ${new Date(
                                  v.createdAt
                                ).toLocaleDateString()}`}
                            </p>

                            <div className="channel-video-actions">
                              <button
                                className="channel-btn secondary"
                                type="button"
                                onClick={() => handleEditClick(v)}
                              >
                                Edit
                              </button>
                              <button
                                className="channel-btn danger"
                                type="button"
                                onClick={() =>
                                  api
                                    .delete(
                                      `/videos/${v._id}`,
                                      authConfig
                                    )
                                    .then(fetchChannel)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Simple placeholders for Playlists / About for now */}
              {activeTab === "Playlists" && (
                <section className="channel-videos">
                  <h3 className="section-title">Playlists</h3>
                  <p>No playlists yet.</p>
                </section>
              )}

              {activeTab === "About" && (
                <section className="channel-videos">
                  <h3 className="section-title">About</h3>
                  <p>{channel.description || "No description."}</p>
                </section>
              )}
            </>
          )}

          {/* POPUP MODAL */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h2 className="modal-title">
                  {editingVideoId ? "Edit Video" : "Add Video"}
                </h2>

                <form
                  className="modal-form"
                  onSubmit={handleSubmit}
                >
                  <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                  />
                  <input
                    name="videoUrl"
                    placeholder="Video URL"
                    value={form.videoUrl}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="thumbnailUrl"
                    placeholder="Thumbnail URL"
                    value={form.thumbnailUrl}
                    onChange={handleChange}
                    required
                  />

                  {error && (
                    <p className="error-text">{error}</p>
                  )}
                  {success && (
                    <p className="success-text">{success}</p>
                  )}

                  <div className="modal-actions">
                    <button
                      className="modal-btn ghost"
                      type="button"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                    <button
                      className="modal-btn primary"
                      type="submit"
                    >
                      {editingVideoId
                        ? "Save changes"
                        : "Create video"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Channel;
