import React, { useEffect } from "react";
import "./chatList.css"; // Import the CSS file

const ChatUsersList = ({ username, room, onButtonClick }) => {
  useEffect(() => {
  }, []);
  return (
    <div className="user-list-container">
      <div className="user-list">
        <div className="username-item">
          {username}
        </div>
      </div>

      <button onClick={onButtonClick} className="action-button">
        ADD
      </button>
    </div>
  );
};

export default ChatUsersList;
