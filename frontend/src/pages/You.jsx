//A page to display the user's account
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

function You() {
  const navigate = useNavigate();

  // Sidebar and search state (same pattern as other pages)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // SAFE context read
  const auth = useContext(AuthContext) || {};
  const user = auth.user;

  // --- NOT LOGGED IN VIEW ---
  if (!user) {
    return (
      <div className="app-layout">
        <Header
          onToggleSidebar={() =>
            setIsSidebarOpen((prev) => !prev)
          }
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={() => {}}
        />

        <div className="main-area">
          <Sidebar isOpen={isSidebarOpen} />

          <main className="content you-page">
            <h2>You</h2>
            <p>You need to sign in to see account details.</p>
            <button
              className="you-view-channel-btn"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </main>
        </div>
      </div>
    );
  }

  // --- LOGGED IN VIEW ---
  const avatar = user.username
    ? user.username[0].toUpperCase()
    : "U";

  const handle =
    "@" + user.username.toLowerCase().replace(/\s+/g, "");

  const myChannelId = localStorage.getItem("myChannelId");

  return (
    <div className="app-layout">
      <Header
        onToggleSidebar={() =>
          setIsSidebarOpen((prev) => !prev)
        }
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={() => {}}
      />

      <div className="main-area">
        <Sidebar isOpen={isSidebarOpen} />

        <main className="content you-page">
          {/* Top profile block */}
          <section className="you-header-section">
            <div className="you-avatar">{avatar}</div>

            <div className="you-info">
              <h2>{user.username}</h2>
              <p className="you-handle">{handle}</p>

              <button
                className="you-view-channel-btn"
                onClick={() => {
                  if (myChannelId) {
                    navigate(`/channel/${myChannelId}`);
                  } else {
                    navigate("/create-channel");
                  }
                }}
              >
                View channel
              </button>
            </div>
          </section>

          {/* History section – placeholder */}
          <section className="you-section">
            <h3>History</h3>
            <div className="you-horizontal-scroll">
              <div className="you-history-card">
                No history available
              </div>
            </div>
          </section>

          {/* Playlists section – placeholder */}
          <section className="you-section">
            <h3>Playlists</h3>
            <div className="you-horizontal-scroll">
              <div className="you-history-card">
                No playlists found
              </div>
            </div>
          </section>

          {/* About section */}
          <section className="you-section">
            <h3>About</h3>
            <p>Email: {user.email || "-"}</p>
            <p>User ID: {user.id || "-"}</p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default You;
