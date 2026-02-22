import React, { useRef, useState, useEffect } from "react";
import "./VideoPlayer.css";
import videoData from "../videos.json";

function VideoPlayer({ video, setVideo, isMaximized, setIsMaximized, onClose }) {
    const iframeRef = useRef(null)
    const playerRef = useRef(null)

    const [isPlaying, setIsPlaying] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const [dragY, setDragY] = useState(0)
    const [startY, setStartY] = useState(0)


    useEffect(() =>{
        const loadVideo = () =>{
            if(!playerRef.current){
                playerRef.current = new window.YT.Player(iframeRef.current, {
                    videoId: video.slug, playerVars: {autoplay: 1,controls: 0,modestbranding: 1,rel: 0}, events:{
                        onReady: (event) =>{
                            setDuration(event.target.getDuration())
                            setIsPlaying(true)
                        },

                        onStateChange: (event) =>{
                            if(event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
                            if(event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
                        },
                    },
                })
            } else{
                playerRef.current.loadVideoById(video.slug)
                }
            };

        if(window.YT && window.YT.Player){
            loadVideo()
        } else{
            const tag = document.createElement("script")
            tag.src = "https://www.youtube.com/iframe_api"
            document.body.appendChild(tag)
            window.onYouTubeIframeAPIReady = loadVideo
        }
    },[video.slug])



    useEffect(() =>{
        const interval = setInterval(() =>{
            if(playerRef.current && playerRef.current.getCurrentTime){
                setCurrentTime(playerRef.current.getCurrentTime())
            }
        },500)
        return () => clearInterval(interval)
    },[])

    const onTouchStart = (e) =>{
        if(!isMaximized) return setStartY(e.touches[0].clientY)
    }

    const onTouchMove = (e) =>{
        if(!isMaximized) return
        const currentY = e.touches[0].clientY
        const deltaY = currentY - startY
        if(deltaY > 0) setDragY(deltaY)
    }

    const onTouchEnd = () =>{
        if(dragY > 150) setIsMaximized(false)
        setDragY(0)
    }

    const togglePlay = (e) =>{
        e.stopPropagation()
        if(!playerRef.current) return
        isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo()
    }

    const handleSkip = (e, amount) =>{
        e.stopPropagation()
        if(!playerRef.current) return
        const newTime = currentTime + amount
        playerRef.current.seekTo(newTime, true)
        setCurrentTime(newTime)
    }

    const handleSeek = (e) => {
        e.stopPropagation()
        const seekTo = parseFloat(e.target.value)
        playerRef.current.seekTo(seekTo, true)
        setCurrentTime(seekTo)
    }

    const formatTime = (time) => {
        const min = Math.floor(time / 60)
        const sec = Math.floor(time % 60)
        return `${min}:${sec < 10 ? "0" : ""}${sec}`
    }

    const getRelatedVideos = () =>{
        const category = videoData.categories.find((cat) => cat.contents.some((v) => v.slug === video.slug))

        return category ? category.contents.filter((v) => v.slug !== video.slug) : []}

    const relatedVideos = getRelatedVideos()

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <div className={`video-player-root ${isMaximized ? "maximized" : "minimized"}`}
        style={{
            transform: isMaximized ? `translateY(${dragY}px)` : "none",
            transition: dragY === 0 ? "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
        }}>



            <div className="player-main-area" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

                <div className="video-wrapper" onClick={() => !isMaximized && setIsMaximized(true)}>

                <div ref={iframeRef}></div>

                {!isMaximized && <div className="mini-click-overlay"></div>}

                </div>


                {!isMaximized && ( <div className="mini-player-content">
                    
                    <div className="mini-top-row" onClick={() => setIsMaximized(true)}>
                    <p className="mini-title">{video.title}</p>
                    <p className="mini-time">{formatTime(currentTime)} / {formatTime(duration)}</p>

                        </div>
                    
                    

                    <div className="mini-controls-row">

                    <button className="mini-btn" onClick={(e) => handleSkip(e, -10)}>-10</button>
                    <button className="mini-btn play-btn" onClick={togglePlay}> {isPlaying ? "Pause" : "Play"} </button>
                    <button className="mini-btn" onClick={(e) => handleSkip(e, 10)}>+10</button>
                    <button className="mini-btn close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>X</button>

                    </div>

                    
                    <input 
                    type="range" min="0" max={duration || 0} 
                    value={currentTime} onChange={handleSeek} 
                    onClick={(e) => e.stopPropagation()}
                    className="mini-seek-bar"
                    />

            </div>
                )}
        </div>

            {isMaximized && (
                <div className="full-details-container">
                <div className="drag-handle-area" onClick={() => setIsMaximized(false)}>
                    <div className="drag-bar"></div>
                </div>

                <div className="controls-overlay">

                    <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="seek-bar"
                    />

                    <div className="time-info">
                        <span>{formatTime(currentTime)}/{formatTime(duration)}</span>
                    </div>


                    <div className="main-btns">

                        <button onClick={(e) => handleSkip(e, -10)}>-10s</button>
                        <button onClick={togglePlay} className="play-pause-big">
                            {isPlaying ? "PAUSE" : "PLAY"}
                        </button>
                        <button onClick={(e) => handleSkip(e, 10)}>+10s</button>

                    </div>

                </div>


                <div className="details-section">

                    <h2 className="video-title">{video.title}</h2>
                    <hr />

                    <div className="related-list">
                        {relatedVideos.map((item) =>(

                            <div key={item.slug} className="related-item" onClick={() => setVideo(item)}>
                                <img src={item.thumbnailUrl} alt={item.title}   />

                                <div className="related-text"> 
                                    <p className="rel-title">{item.title}</p>
                                </div>
                            </div>

                        ))}
                    </div>

                </div>
                </div>
            )}

        
        </div>
    )
}

export default VideoPlayer;