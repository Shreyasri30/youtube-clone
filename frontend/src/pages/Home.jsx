// Home page: displays feed of videos from MongoDB
// with category filters and responsive layout.

import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import api from "../api";

// Categories similar to YouTube's horizontal filter bar
const YT_CATEGORIES = [
  "All",
  "React",
  "JavaScript",
  "Full Stack",
  "CSS",
  "Backend",
  "Database",
  "Security",
  "Frontend",
  "Tools",
  "DSA",
  "System Design",
  "Data Structures",
  "Software",
  "AI",
  "Live",
  "VS Code",
  "Coding",
  "Machine Learning"
];

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  const filtersRef = useRef(null);

  /**
   * Fetch videos from API.
   * Supports optional ?search=&category= filters.
   */
  const fetchVideos = async () => {
    try {
      setLoading(true);

      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== "All") params.category = selectedCategory;

      const res = await api.get("/videos", { params });
      setVideos(res.data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch category-based videos when category changes.
  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Manual search trigger (if search bar is used inside Home)
  const handleSearch = () => {
    fetchVideos();
  };

  /**
   * Horizontal scroll for the category bar
   */
  const scrollLeft = () => {
    filtersRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    filtersRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

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
          {/* Category chips row */}
          <div className="filters-wrapper">
            <button className="scroll-arrow left" onClick={scrollLeft}>
              ‹
            </button>

            <div className="filters-row" ref={filtersRef}>
              {YT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={
                    cat === selectedCategory
                      ? "filter-chip active"
                      : "filter-chip"
                  }
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button className="scroll-arrow right" onClick={scrollRight}>
              ›
            </button>
          </div>

          {/* Loader / No results / Grid */}
          {loading ? (
            <p className="info-text">Loading videos...</p>
          ) : videos.length === 0 ? (
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

export default Home;
