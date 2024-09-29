import React from "react";
import ReactPlayer from "react-player";

const VideoTile = () => {
  return (
    <div>
      <div className="video-player-wrapper">
      <ReactPlayer
        url={`http://localhost:8000/Uploads/file-1727524648514-175349937.mp4`}
        controls={true}
        width="100%"
        height="80%"
      />
    </div>
    </div>
  );
};

export default VideoTile;
