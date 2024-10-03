import React from "react";
import ReactPlayer from "react-player";
import "./chat.css";
const FileTile = (props) => {
    const message = props.message;
  return (
    <div>
      <div
        key={message.messageId}
        className={`image-chat-container ${
          props.alignReverse ? "row-reverse" : ""
        }`}
      >
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
            {!props.alignReverse ? null : message.seen ? (
              <span>✔️</span>
            ) : (
              <span>✓</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileTile;
