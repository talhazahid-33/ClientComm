import React, { useEffect } from "react";
import "./chatList.css"; 
import { Avatar } from "@mui/material";

const ChatUsersList = ({ username }) => {
  useEffect(() => {
  }, []);
  return (
    <div className="user-list-container">
        <div>
          <Avatar>{username[0]}</Avatar>
        </div>
        <div style={{fontSize:'20px', marginLeft:'5px'}} >
          {username}
        </div>
    </div>
  );
};

export default ChatUsersList;
