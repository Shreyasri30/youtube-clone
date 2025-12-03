import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";

import { AuthProvider, AuthContext } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import CreateChannel from "./pages/CreateChannel";
import You from "./pages/You";
import SearchResults from "./pages/SearchResults";

/* =====================================================
   PROTECTED ROUTE FOR "Your videos"

   Logic:
   - If user NOT logged in then redirect to /login
   - If logged in but has no channel then /create-channel
   - Else /channel/<id>
===================================================== */
function YourVideosRoute() {
  const auth = useContext(AuthContext) || {};
  const user = auth.user;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const storedChannelId = localStorage.getItem("myChannelId");
  const firstChannelFromUser =
    user.channels && user.channels.length > 0
      ? user.channels[0]
      : null;

  const channelId = storedChannelId || firstChannelFromUser;

  if (!channelId) {
    return <Navigate to="/create-channel" replace />;
  }

  return <Navigate to={`/channel/${channelId}`} replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* HOME + AUTH */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* VIDEO PLAYER */}
          <Route path="/video/:id" element={<VideoPlayer />} />

          {/* CHANNEL PAGES */}
          <Route path="/channel/:id" element={<Channel />} />
          <Route path="/create-channel" element={<CreateChannel />} />

          {/* YOUR VIDEOS REDIRECT */}
          <Route path="/your-videos" element={<YourVideosRoute />} />

          {/* YOU PAGE (account dashboard) */}
          <Route path="/you" element={<You />} />
          
          {/* SEARCH RESULTS PAGE */}
          <Route path="/search" element={<SearchResults />} />


          {/* Other sidebar links using Home as placeholder */}
          <Route path="/shorts" element={<Home />} />
          <Route path="/subscriptions" element={<Home />} />
          <Route path="/history" element={<Home />} />
          <Route path="/watch-later" element={<Home />} />
          <Route path="/playlists" element={<Home />} />
          <Route path="/shopping" element={<Home />} />
          <Route path="/music" element={<Home />} />
          <Route path="/movies" element={<Home />} />
          <Route path="/gaming" element={<Home />} />
          <Route path="/news" element={<Home />} />
          <Route path="/premium" element={<Home />} />
          <Route path="/yt-music" element={<Home />} />
          <Route path="/yt-kids" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
