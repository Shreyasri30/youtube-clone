import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// --- Simple icons (SVG) ---

const HomeIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 3 3 10h2v11h6v-6h2v6h6V10h2L12 3z"
    />
  </svg>
);

const ShortsIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M10 3 6 7v10l4 4 8-4V3l-8 4V3z"
    />
  </svg>
);

const HistoryIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M13 3a8 8 0 1 0 7.94 7H19a6 6 0 1 1-6-6V3zm-1 3v5h4v-2h-2V6z"
    />
  </svg>
);

const LibraryIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M4 5h16v2H4zm0 4h16v10H4z"
    />
  </svg>
);

const PlayIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M8 5v14l11-7z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1 11h-4V7h2v4h2z"
    />
  </svg>
);

const MusicIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M9 18a3 3 0 1 0 2 2.83V9h8V5H9z"
    />
  </svg>
);

const MovieIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M4 4h4l2 4h4l2-4h4v16H4z"
    />
  </svg>
);

const GameIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M6 7 3 9v8h4l2 2h6l2-2h4V9l-3-2zm2 5H7v2H5v-2H3v-2h2v-2h2v2h1zm7 3a1.5 1.5 0 1 1 1.5-1.5A1.502 1.502 0 0 1 15 15z"
    />
  </svg>
);

const NewsIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M4 4h14v14H4zM6 6v2h10V6zm0 4v2h5v-2zm0 4v2h7v-2z"
    />
  </svg>
);

const UserIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 4a4 4 0 1 1-4 4 4.003 4.003 0 0 1 4-4zm0 8a6 6 0 0 0-6 6v1h12v-1a6 6 0 0 0-6-6z"
    />
  </svg>
);

// --- Sidebar component ---

function Sidebar({ isOpen }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const sidebarClass = isOpen ? "sidebar open" : "sidebar collapsed";

  const topMenuGuest = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Shorts", path: "/shorts", icon: <ShortsIcon /> },
    { label: "You", path: "/you", icon: <UserIcon /> },
    { label: "History", path: "/history", icon: <HistoryIcon /> }
  ];

  const topMenuUser = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Shorts", path: "/shorts", icon: <ShortsIcon /> },
    { label: "Subscriptions", path: "/subscriptions", icon: <LibraryIcon /> },
    { label: "You", path: "/you", icon: <UserIcon /> },
    { label: "History", path: "/history", icon: <HistoryIcon /> }
  ];

  const librarySection = [
    { label: "Your videos", path: "/your-videos", icon: <PlayIcon /> },
    { label: "Watch later", path: "/watch-later", icon: <ClockIcon /> },
    { label: "Playlists", path: "/playlists", icon: <LibraryIcon /> }
  ];

  const exploreSection = [
    { label: "Shopping", path: "/shopping", icon: <HomeIcon /> },
    { label: "Music", path: "/music", icon: <MusicIcon /> },
    { label: "Movies", path: "/movies", icon: <MovieIcon /> },
    { label: "Gaming", path: "/gaming", icon: <GameIcon /> },
    { label: "News", path: "/news", icon: <NewsIcon /> }
  ];

  const moreSection = [
    { label: "YouTube Premium", path: "/premium", icon: <PlayIcon /> },
    { label: "YouTube Music", path: "/yt-music", icon: <MusicIcon /> },
    { label: "YouTube Kids", path: "/yt-kids", icon: <UserIcon /> }
  ];

  // when clicking "Your videos"
  const handleYourVideosClick = () => {
    if (!user) {
      // not logged in then ask to login
      navigate("/login");
      return;
    }

    let myChannelId = null;
    try {
      myChannelId = localStorage.getItem("myChannelId");
    } catch (e) {
      console.warn("Unable to read myChannelId from localStorage", e);
    }

    if (myChannelId) {
      navigate(`/channel/${myChannelId}`);
    } else {
      // user logged in but no channel yet then go create channel
      navigate("/create-channel");
    }
  };

  const renderItem = (item) => {
    // special handling for "Your videos"
    if (item.label === "Your videos") {
      return (
        <li key={item.label}>
          <button
            type="button"
            className="sidebar-item sidebar-linklike"
            onClick={handleYourVideosClick}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        </li>
      );
    }

    return (
      <li key={item.label}>
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            "sidebar-item" + (isActive ? " active" : "")
          }
        >
          <span className="sidebar-icon">{item.icon}</span>
          <span className="sidebar-label">{item.label}</span>
        </NavLink>
      </li>
    );
  };

  return (
    <aside className={sidebarClass}>
      <nav>
        {/* Top menu */}
        <ul className="sidebar-section">
          {(user ? topMenuUser : topMenuGuest).map(renderItem)}
        </ul>

        <hr className="sidebar-divider" />

        {/* Sign in prompt when logged out */}
        {!user && (
          <>
            <div className="sidebar-signin-box">
              <p>Sign in to like videos, comment, and subscribe.</p>
              <button
                type="button"
                className="signin-btn"
                onClick={() => navigate("/login")}
              >
                <span className="sidebar-icon">
                  <UserIcon />
                </span>
                <span className="sidebar-label">Sign in</span>
              </button>
            </div>
            <hr className="sidebar-divider" />
          </>
        )}

        {/* Library – only when logged in */}
        {user && (
          <>
            <p className="sidebar-title">Library</p>
            <ul className="sidebar-section">
              {librarySection.map(renderItem)}
            </ul>
            <hr className="sidebar-divider" />
          </>
        )}

        {/* Explore */}
        <p className="sidebar-title">Explore</p>
        <ul className="sidebar-section">
          {exploreSection.map(renderItem)}
        </ul>

        <hr className="sidebar-divider" />

        {/* More from YouTube */}
        <p className="sidebar-title">More from YouTube</p>
        <ul className="sidebar-section">
          {moreSection.map(renderItem)}
        </ul>

        <hr className="sidebar-divider" />

        <p className="sidebar-title">Settings</p>
      </nav>
    </aside>
  );
}

export default Sidebar;
