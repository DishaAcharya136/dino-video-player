import React, { useState } from "react";
import Home from "./pages/Home.jsx";
import VideoPlayer from "./pages/VideoPlayer.jsx";

function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setIsMaximized(true);
  };

  return (
    <div className="app-container">
      {/* Home always stays in the background */}
      <Home onSelectVideo={handleSelectVideo} />

      {/* VideoPlayer only appears once a video is clicked, 
          but stays alive when minimized */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          setVideo={setSelectedVideo}
          isMaximized={isMaximized}
          setIsMaximized={setIsMaximized}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}

export default App;