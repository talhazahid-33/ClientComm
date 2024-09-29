import React from "react";

import "./chat.css";
const FileTile = (props) => {
  const handleDownload = () => {
    console.log("Download: ", props.path);
    const link = document.createElement('a');
    
    link.href = "http://localhost:8000/" + props.path; 
    link.download = props.path.split('/').pop(); 
    link.target = '_blank'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div>
      <div
        key={props.index}
        className={`image-chat-container ${
          props.alignReverse ? "row-reverse" : ""
        }`}
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
              {props.path ? (
                <>
                  {props.type === "image" ? (
                    <>
                  <p>{props.name}</p>
                      <img
                        src={`http://localhost:8000/${props.path}`}
                        alt="Uploaded"
                        style={{ width: "140px", height: "120px" }}
                      />
                    </>
                  ) : (
                    <>
                     <b> <p onClick={handleDownload}>{props.name}</p></b>
                    </>
                  )}
                </>
              ) : (
                <p>No image available</p>
              )}
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
