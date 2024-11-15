import React, { useEffect, useState } from "react";
import "./chat.css";
import DeleteDialog from "./DeleteDialog";
import DoneAllSharpIcon from "@mui/icons-material/DoneAllSharp";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";

const ChatMessage = (props) => {
  const [hover, setHover] = useState(false);
  const { message } = props;
  useEffect(()=>{
   // console.log(props);
    
  })

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
              {!message.deleted ? (
                <p className="p">{message.message}</p>
              ) : (
                <p className="deletedMessage">{message.message}</p>
              )}
              {!props.alignReverse ? null : message.seen ? (
                <DoneAllSharpIcon fontSize="small" color="primary" />
              ) : (
                <DoneSharpIcon fontSize="small" />
              )}
            </div>
          </div>
        </div>
        {hover && (
          <DeleteDialog
            index={props.index}
            deleted={message.deleted}
            deleteMessage={props.deleteMessage}
            delForEveryone={props.alignReverse}
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
