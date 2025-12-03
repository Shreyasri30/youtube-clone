import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

const initialForm = {
  channelName: "",
  description: ""
};

function CreateChannel() {
  const navigate = useNavigate();
  const { token, user, setUser } = useContext(AuthContext); //added setUser

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const authConfig = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Please login to create a channel.");
      return;
    }

    try {
      const res = await api.post("/channels", form, authConfig);
      const channel = res.data.channel;
      setSuccess("Channel created successfully!");

      /* ==========================================
         SAVE CHANNEL ID FOR SIDEBAR "YOUR VIDEOS"
      ========================================== */
      try {
        localStorage.setItem("myChannelId", channel._id);
      } catch (e) {
        console.warn("Could not save myChannelId to localStorage", e);
      }

      /* ==================================================
         UPDATE GLOBAL USER IMMEDIATELY 
      =================================================== */
      if (user && setUser) {
        const updated = {
          ...user,
          channels: [...(user.channels || []), channel._id]
        };

        setUser(updated); // update global context
      }

      /* ==========================================
         REDIRECT TO THE NEW CHANNEL PAGE
      ========================================== */
      setTimeout(() => {
        navigate(`/channel/${channel._id}`);
      }, 800);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to create channel.");
    }
  };

  const derivedHandle = form.channelName
    ? "@" + form.channelName.toLowerCase().replace(/\s+/g, "")
    : "@" + (user?.username?.toLowerCase() || "yourhandle");

  const avatarLetter = form.channelName
    ? form.channelName.charAt(0).toUpperCase()
    : (user?.username?.[0]?.toUpperCase() || "G");

  return (
    <div className="create-channel-overlay">
      <div className="create-channel-modal">
        <div className="create-channel-card">
          <div className="create-channel-header">
            <h2 className="create-channel-title">How you'll appear</h2>
            <p className="create-channel-subtitle">
              This information will be shown on your YouTube channel.
            </p>
          </div>

          {/* Centered avatar and Select picture */}
          <div className="create-channel-top-row">
            <div className="create-channel-avatar-block">
              <div className="create-channel-avatar-circle">
                {avatarLetter}
              </div>
              <button
                type="button"
                className="create-channel-avatar-link"
                disabled
              >
                Select picture
              </button>
            </div>
          </div>

          <form className="create-channel-form" onSubmit={handleSubmit}>
            <div className="create-channel-field">
              <label className="create-channel-label">Name</label>
              <input
                type="text"
                name="channelName"
                placeholder="Channel name"
                value={form.channelName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-channel-field">
              <label className="create-channel-label">Handle</label>
              <input type="text" value={derivedHandle} readOnly />
              <p className="create-channel-help">
                Your handle is unique to you. It helps others find your channel.
              </p>
            </div>

            <div className="create-channel-field">
              <label className="create-channel-label">Description</label>
              <textarea
                name="description"
                placeholder="Tell viewers about your channel"
                rows={4}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <div className="create-channel-actions">
              <button
                type="button"
                className="create-channel-btn ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button type="submit" className="create-channel-btn primary">
                Create channel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateChannel;
