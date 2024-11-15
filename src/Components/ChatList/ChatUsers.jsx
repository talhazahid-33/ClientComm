import React, { useEffect } from "react";
import "./chatList.css";
import { Avatar } from "@mui/material";

const ChatUsersList = ({ activeStatus, username }) => {
  useEffect(() => {}, []);
  return (
    <div className="user-list-container">
    { username !== "-1"?<>
      <div style={{display:'flex' , flexDirection:'row'}}>
        <Avatar>{username[0]}</Avatar>
        <div style={{ marginLeft: "5px" }}>
          <p style={{ fontSize: "20px", margin: 0 }}>{username}</p>
          <p style={{ fontSize: "10px", margin: 0 }}>{activeStatus}</p>
        </div>
      </div>
      </>:null
    } 
    </div>

  );
};

export default ChatUsersList;
