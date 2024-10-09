import React, { useState, useRef } from "react";
import MicTwoToneIcon from "@mui/icons-material/MicTwoTone";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import { Box, Typography } from "@mui/material";

const VoiceMessage = (props) => {
  const { handleVoiceMessage } = props;
  const [audioFile, setAudioFile] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [recording, setRecording] = useState(false);
  const [showMic, setShowMic] = useState(true);
  const [pause, setPause] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);

  const handleRecording = async () => {
    setAudioURL("");
    setAudioFile(null);
    console.log("Starting Audio");
    setRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      let chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], "recorded-audio.webm", {
          type: "audio/webm",
        });
        console.log("File : ", file);
        setAudioFile(file);

        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        chunks = [];
        stopStream();
        console.log("Pause : ", pause);
        if (!pause) {
         // handleVoiceMessage(file);
        }
      };
    } catch (err) {
      console.error("Error accessing the microphone:", err);
    }
  };

  const stopStream = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const deleteRecording = () => {
    setAudioFile(null);
    setRecording(false);
    setShowMic(true);
    setAudioURL("");
    stopStream();
    setPause(false);
  };

  const startRecording = () => {
    setRecording(true);
    setShowMic(false);
    handleRecording();
  };

  const pauseRecording = () => {
    console.log("Pausing Recording");
    setPause(true);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    stopStream();
    setRecording(false);
  };

  const pauseAndSend = () => {
    handleVoiceMessage(audioFile);
    setRecording(false);
    setShowMic(true);
    setAudioFile(null);
    setAudioURL(null);
    setPause(false);
  };

  const sendRecording =  () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    console.log("Audio File (send) : ", audioFile);
    setRecording(false);
    setShowMic(true);
    setAudioFile(null);
    setAudioURL(null);
    setPause(false);
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        sx={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
      >
        {recording && (
          <>
            <PauseRoundedIcon onClick={pauseRecording} />
            <Typography variant="body1">Recording ...</Typography>
            <SendSharpIcon onClick={sendRecording} />
          </>
        )}
        {showMic && (
          <>
            <MicTwoToneIcon
              onClick={startRecording}
              style={{ cursor: "pointer", fontSize: "40px" }}
            />
          </>
        )}
        {audioURL && !showMic && (
          <>
            <DeleteOutlineRoundedIcon onClick={deleteRecording} />
            <audio
              controls
              src={audioURL}
              style={{ marginLeft: "10px" }}
            ></audio>
            <SendSharpIcon onClick={pauseAndSend} />
          </>
        )}
      </Box>
    </div>
  );
};

export default VoiceMessage;
