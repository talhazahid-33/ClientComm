import React from "react";

import "./chat.css";
const FileTile = (props) => {
  const handleFileDownload = (file) => {
    console.log("props file Tile : ", props);
    const link = document.createElement("a");
    link.href = file.data;
    link.download = file.name;
    link.click();
  };
  return (
    <div>
      <div
        key={props.index}
        className={`chat-container${props.alignReverse ? "row-reverse" : ""}`}
      >
        <div className="upper-division">
          <span className="email">{props.username}</span>
          <span className="time">{props.time}</span>
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
              <p>{props.file.name}</p>
              <button onClick={() => handleFileDownload(props.file)}>
                Download
              </button>
            </div>
            {!props.alignReverse ? null : props.seen ? (
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
