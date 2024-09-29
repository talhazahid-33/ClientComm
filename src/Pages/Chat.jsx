import React, { useEffect, useState } from "react";
import ChatTab from "../Components/ChatTab";
import socket from "./sockets";
import { useDispatch } from "react-redux";
import { addMessages } from "../Redux/messagesSlice";
import axios from "axios";

const Chat = () => {
  const username = localStorage.getItem("username");
  const dispatch = useDispatch();
  useEffect(() => {
    socket.emit("selfroom", "admin");
  }, []);

  useEffect(() => {
    getallmessages();
  }, []);

  async function getallmessages() {
    try {
      const result = await axios.get("http://localhost:8000/getallmessages");
      if (result.status === 200) {
        dispatch(addMessages(result.data.data));
      } else console.log("API call error Get All Messages");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="chat-page">
      <div></div>
      <div>
        <ChatTab />
      </div>
    </div>
  );
};

export default Chat;
