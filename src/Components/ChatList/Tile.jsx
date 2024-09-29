import React from "react";
import "./chatList.css";

import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";

const ChatTile = ({ username, lastMessage, time, newMessages }) => {
  return (
    <div className="chat-tile">
      <div className="chat-info">
        <h4>{username}</h4>
        <p>{lastMessage}</p>
      </div>
      <div className="chat-time">
        <small>{time}</small>
        <br></br>
        <Badge color="success" badgeContent={newMessages}></Badge>
      </div>
    </div>
  );
};

export default ChatTile;
