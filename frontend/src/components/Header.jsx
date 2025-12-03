// Global header used across all screens.
// Provides: sidebar toggle, universal search, channel actions,
// user dropdown and navigation to /search results page.

import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Header({ onToggleSidebar, searchTerm, setSearchTerm }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Read user's own channel ID from localStorage
  let myChannelId = null;
  try {
    myChannelId = localStorage.getItem("myChannelId");
  } catch {
    myChannelId = null;
  }

  /**
   * Submit handler for global search.
   * Navigates to /search?q=<term> from ANY page.
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="header">
      {/* Left Section: Sidebar toggle and Logo */}
      <div className="header-left">
        <button
          type="button"
          className="icon-button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

    <div className="logo" onClick={() => navigate("/")}>
      <span className="logo-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
        <path
          fill="#FF0000"
          d="M21.8 8.001a2.749 2.749 0 0 0-1.93-1.947C18.23 5.5 12 5.5 12 5.5s-6.23 0-7.87.554A2.749 2.749 0 0 0 2.2 8.001 28.44 28.44 0 0 0 1.5 12a28.44 28.44 0 0 0 .7 3.999 2.749 2.749 0 0 0 1.93 1.947C5.77 18.5 12 18.5 12 18.5s6.23 0 7.87-.554a2.749 2.749 0 0 0 1.93-1.947A28.44 28.44 0 0 0 22.5 12a28.44 28.44 0 0 0-.7-3.999z"
        />
      <path fill="#FFFFFF" d="M10 15.25 15 12 10 8.75z" />
      </svg>
    </span>
   <span>YouTube Clone</span>
  </div>

      </div>

      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button type="submit">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 
              6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79
              L19 20.5 20.5 19 15.5 14zm-6 0C7.01 14 5 11.99 
              5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
        </button>
      </form>

      {/* Right Section: User actions */}
      <div className="header-right" ref={menuRef}>
        {!user ? (
          // Not logged in then show Sign In button
          <Link to="/login" className="auth-button">
            Sign in
          </Link>
        ) : (
          <>
            {/* Create/View channel button */}
            <button
              className="create-button"
              type="button"
              onClick={() => {
                if (myChannelId) {
                  navigate(`/channel/${myChannelId}`);
                } else {
                  navigate("/create-channel");
                }
              }}
            >
              {myChannelId ? "View channel" : "Create channel"}
            </button>

            {/* Username label */}
            <span className="header-username">
              {user.username}
            </span>

            {/* Avatar Circle */}
            <div
              className="header-avatar-circle"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {user.username?.[0]?.toUpperCase()}
            </div>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="avatar-dropdown">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
