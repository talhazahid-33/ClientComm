import React, { useState, useRef, useEffect } from "react";
import { Box, Slider, Typography, IconButton } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import DoneAllSharpIcon from "@mui/icons-material/DoneAllSharp";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import DeleteDialog from "./DeleteDialog";
import "./chat.css";

const AudioTile = (props) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  const [hover, setHover] = useState(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audioDuration = audioRef.current.duration;
    if (Number.isFinite(audioDuration)) {
      setDuration(audioDuration);
    }
  };

  const handleSliderChange = (event, newValue) => {
    if (Number.isFinite(newValue)) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleSpeedChange = () => {
    const newSpeed = speed === 1 ? 1.5 : 1;
    audioRef.current.playbackRate = newSpeed;
    setSpeed(newSpeed);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div
      key={props.index}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: "",
          flexDirection: props.alignReverse ? "row-reverse" : "row",
        }}
      >
        <div className={`chat-container ${false ? "row-reverse" : ""}`}>
          <div className="upper-division">
            <span className="email">{props.username}</span>
            <span className="time">{props.time}</span>
          </div>

          <div className="lower-division">
            <Box display="flex" alignItems="center">
              <IconButton onClick={handlePlayPause}>
                {isPlaying ? (
                  <PauseRoundedIcon fontSize="large" />
                ) : (
                  <PlayArrowRoundedIcon fontSize="large" />
                )}
              </IconButton>

              <Slider
                value={Number.isFinite(currentTime) ? currentTime : 0}
                min={0}
                max={Number.isFinite(duration) ? duration : 10}
                onChange={handleSliderChange}
                sx={{ marginLeft: "10px", flexGrow: 1 }}
              />

              <Typography
                variant="body2"
                sx={{ marginLeft: "10px", fontSize: "0.6rem" }}
              >
                {formatTime(currentTime)}
              </Typography>

              <IconButton onClick={handleSpeedChange}>
                <SpeedRoundedIcon />
                <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                  {speed}x
                </Typography>
              </IconButton>
              {!props.alignReverse ? null : props.seen ? (
                <DoneAllSharpIcon fontSize="small" color="primary" />
              ) : (
                <DoneSharpIcon fontSize="small" />
              )}

              <audio
                ref={audioRef}
                src={`http://localhost:8000/${props.url}`}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              ></audio>
            </Box>
          </div>
        </div>
        {hover && (
          <DeleteDialog
            index={props.index}
            deleteMessage={props.deleteMessage}
            delForEveryone={props.alignReverse}
          />
        )}
      </div>
    </div>
  );
};

export default AudioTile;
