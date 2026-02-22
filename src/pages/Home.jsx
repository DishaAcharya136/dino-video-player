import React from "react";
import videoData from "../videos.json"
import "./Home.css"

function Home({onSelectVideo}){
    return (
        <div className="home">
            {videoData.categories.map((item, index) => (
                <div key={index} className="cat-section">
                    <div className="cat-header">
                        <img src={item.category.iconUrl}
                        alt={item.category.name}
                        className="cat-icon" />
                        <h2 className="cat-title">{item.category.name}</h2>
                    </div>
                    {item.contents.map((video, i) => (
                        <div key={i} className="card" onClick={() => onSelectVideo(video)}>
                            <img src={video.thumbnailUrl}
                            alt={video.title}
                            className="thumbnail" />

                    <div className="video-info">
                        <p className="video-title">{video.title}</p>
                        <span className="cat-badge">{item.category.name}</span>
                        </div>
                    </div>    
            ))}
        </div>
            ))}
            </div>
    )
}

export default Home;


