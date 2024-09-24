import React, { useEffect, useState } from "react";
import ChatTab from "../Components/ChatTab";
import socket from "./sockets";

const Chat = () => {
  const username = localStorage.getItem("username");
  useEffect(()=>{
    socket.emit("selfroom",username);
    socket.emit("selfroom","admin");
  },[])
  
  return (
    <div className="chat-page">
        <div>

        </div>
      <div>
        <ChatTab />
      </div>
    </div>
  );
};

export default Chat;
