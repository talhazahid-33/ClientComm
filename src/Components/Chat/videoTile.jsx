import React, { useState } from "react";
import ReactPlayer from "react-player";
import "./chat.css";
import DeleteDialog from "./DeleteDialog";

import DoneAllSharpIcon from '@mui/icons-material/DoneAllSharp';
import DoneSharpIcon from '@mui/icons-material/DoneSharp';
const FileTile = (props) => {
    const message = props.message;
    
  const [hover, setHover] = useState(false);
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
          <span className="email">{message.sender}</span>
          <span className="time">{message.time}</span>
        </div>

        <div className="lower-division">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div>
              {message.data ? (
                <>
                  {message.type === "video" ? (
                    <>
                      <p>{message.name}</p>
                      <div className="video-player-wrapper">
                        <ReactPlayer
                          url={`http://localhost:8000/${message.data}`}
                          controls={true}
                          width="100%"
                          height="80%"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <b>
                        <p>{message.name}</p>
                      </b>
                    </>
                  )}
                </>
              ) : (
                <p>No image available</p>
              )}
            </div>
            {!props.alignReverse ? null : props.seen ? (
              
              <DoneAllSharpIcon fontSize="small" color="primary"/>
            ) : (
              <DoneSharpIcon fontSize="small" />
            )}
          </div>
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

export default FileTile;
