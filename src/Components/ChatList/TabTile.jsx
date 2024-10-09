import React from "react";
import "./chatList.css";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";

const ChatTile = ({ username, lastMessage, time, newMessages, index }) => {
  function truncateString(str) {
    return str.length > 20 ? str.substring(0, 20) + "..." : str;
  }
  return (
    <div key={index} className="chat-tile">
      <div style={styles.avatarDiv}>
        <Avatar style={styles.avatar}>{username[0]}</Avatar>
        <div className="chat-info">
          <h4>{username}</h4>
          <p>{truncateString(lastMessage)}</p>
        </div>
      </div>
      <div className="chat-time">
        <small>{time}</small>
        <br></br>
        <small>{index}</small>
        <Badge color="success" badgeContent={newMessages}></Badge>
      </div>
    </div>
  );
};

export default ChatTile;

const styles = {
  avatarDiv :{
    display :'flex',
    flexDirection : 'row',
  },
  avatar:{
    marginRight : '10px',
  }
}
