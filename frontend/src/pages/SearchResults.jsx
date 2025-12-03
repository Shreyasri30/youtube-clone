// SearchResults: shows videos matching the global search query (?q=)
// Triggered whenever user searches from the header on any page.

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import api from "../api";

// Helper to read query params from URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const q = query.get("q") || "";

  useEffect(() => {
    setSearchTerm(q);

    const fetchResults = async () => {
      if (!q.trim()) {
        setVideos([]);
        return;
      }

      try {
        const res = await api.get("/videos/search", {
          params: { query: q.trim() },
        });
        setVideos(res.data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchResults();
  }, [q]);

  return (
    <div className="app-layout">
      <Header
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="main-area">
        <Sidebar isOpen={isSidebarOpen} />

        <main className="content search-results">
          <h2>Search results for "{q}"</h2>

          {videos.length === 0 ? (
            <p className="info-text">No videos found.</p>
          ) : (
            <div className="video-grid">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default SearchResults;
