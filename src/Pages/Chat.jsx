import React, { useEffect } from "react";
import ChatTab from "../Components/ChatTab";
import socket from "./sockets";
import { useDispatch } from "react-redux";
import { addMessages } from "../Redux/messagesSlice";
import axios from "axios";

const Chat = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    socket.emit("selfroom", "admin");
    getallmessages();
  }, []);

  useEffect(() => {
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
        <ChatTab />
    </div>
  );
};

export default Chat;
