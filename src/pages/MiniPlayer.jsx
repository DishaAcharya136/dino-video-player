import React from "react";
import "./VideoPlayer.css";

function MiniPlayer({video, isPlaying, togglePlay, onMaximize, onClose}){
    return (
        <div className="mini-player-bar" onClick={onMaximize}>
            <div className="mini-video-preview">
                <img src={video.thumbnailUrl} alt="preview" />
            </div>

            <div className="mini-info">
            <p className="mini-title">{video.title}</p>
        </div>

        <div className="mini-actions">
            <button onClick={togglePlay}>
            {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={onClose}>Close</button>
        </div>
        </div>
    )
}

export default MiniPlayer