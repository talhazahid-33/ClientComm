import React from "react";
import "./chat.css";
import DeleteIcon from "@mui/icons-material/Delete";

const ChatMessage = (props) => {
  const deleteMessage = () => {
    console.log("Delete ", props.index);
    props.deleteMessage(props.index);
  };
  return (
    <div
      key={props.index}
      className={`chat-container ${props.alignReverse ? "row-reverse" : ""}`}
    >
      <div className="upper-division">
        <span className="email">{props.username}</span>
        <span className="time">
          {props.time}
          <DeleteIcon onClick={deleteMessage} />
        </span>
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
          <p className="p">{props.message}</p>
          {!props.alignReverse ? null : props.seen ? (
            <span>✔️</span>
          ) : (
            <span>✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
