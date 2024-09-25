import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ChatMessage from "./chatTile";
import socket from "../../Pages/sockets";
import { v4 as uuid } from "uuid";
import FileTile from "./fileTile";

const ChatRoom = (props) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [roomItems, setRoomItems] = useState([]);

  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [roomItems]);

  useEffect(() => {
    //getMessages();
    getFiles();
  }, [props.roomid]);

  const populateRooms = () => {
    const roomItems = messages.map((msg) => ({
      type: "text",
      message: msg,
    }));
    setRoomItems(roomItems);
    console.log("roomItems ", roomItems);
  };
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("Msg Received");
      console.log("receiving socket Message ", data);

      if (data.roomId == props.roomid) {
        console.log("Calling Update Seen");
        socket.emit("update_seen", {
          roomId: props.roomid,
          messageId: data.messageId,
        });
        setMessages((prevMessages) => [...prevMessages, data]);
        setRoomItems((prevItems) => [...prevItems, data]);
      } else console.log("Message belongs to room ", data.roomId);
    };

    const handleSeenUpdate = (data) => {
      console.log("handleSeenUpdate ", data);
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.messageId == data.messageId
            ? { ...message, seen: true }
            : message
        )
      );
    };

    const handleSeenUpdateForAll = (data) => {
      console.log("Handle seen update for All", data);
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.sender !== data.username
            ? { ...message, seen: true }
            : message
        )
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("listen_seen_update", handleSeenUpdate);
    socket.on("listen_update_seen_for_all", handleSeenUpdateForAll);
    socket.on("receive_item", (data) => {
      console.log("file", data);
      console.log("all ", roomItems);
      setRoomItems((prevItems) => [...prevItems, data]);
    });
    return () => {
      socket.off("receive_item");
      socket.off("receive_message", handleReceiveMessage);
      socket.off("listen_seen_update", handleSeenUpdate);
      socket.off("listen_update_seen_for_all", handleSeenUpdateForAll);
    };
  }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return now.toLocaleTimeString("en-US", options);
  };
  const updateSeen = async (messageId) => {
    try {
      const result = await axios.post("http://localhost:8000/updateseen", {
        messageId: messageId,
      });
      if (result.status === 200) console.log("Seen status updated");
      else console.log("DB error occured in seen update");
    } catch (error) {
      console.log(error);
    }
  };
  const saveMessage = async (newMessage) => {
    try {
      const result = await axios.post(
        "http://localhost:8000/savemessage",
        newMessage
      );
      if (result.status === 200) {
        console.log("Message Saved");
      } else {
        console.log("Error Saving Messages");
      }
    } catch (error) {}
  };
  const sendMessage = async () => {
    const time = getCurrentTime();
    if (file) {
      const newMessage = {
        messageId: uuid(),
        sender: username,
        seen: false,
        roomId: props.roomid,
        file: file,
        time: time,
        type: "file",
      };
      setRoomItems((prevItems) => [...prevItems, newMessage]);
      console.log("file", file);
      socket.emit("send_file", newMessage);
      setFile(null);
      return;
    }
    if (message === "") return;
    const newMessage = {
      messageId: uuid(),
      type: "text",
      sender: username,
      seen: false,
      roomId: props.roomid,
      message: message,
      time: time,
    };
    try {
      socket.emit("send_message_admin", newMessage);
      //setMessages((prevMsgs) => [...prevMsgs, newMessage]);

      setRoomItems((prevItems) => [...prevItems, newMessage]);
      saveMessage(newMessage);
      props.UpdateRoomLastMessage(props.roomid, newMessage.message);
      setMessage("");
    } catch (error) {
      console.log("Error sending Message");
    }
  };
  const getRoomsList = () => {
    socket.emit("get_rooms");

    return () => {
      socket.off("rooms_list");
    };
  };

  const getFiles = async()=>{
    try{
      const result = await axios.post("http://localhost:8000/getfiles",{roomId:props.roomid});
      if(result.status === 200){
        console.log(result.data);
        setRoomItems(result.data.data);

      }
      else{
        console.log("DB status Error in getFiles");
      }

    }catch(error){
      console.log(error);
    }
  }

  const getMessages = async () => {
    try {
      console.log("Passig RID ", props.roomid);
      const result = await axios.post("http://localhost:8000/getmessages", {
        roomId: props.roomid,
      });
      if (result.status === 200) {
        const roomItems = result.data.data.map((msg) => ({
          type: "text",
          message: msg,
        }));
        setRoomItems(result.data.data);
        //setMessages(result.data.data);

        socket.emit("update_seen_for_all", {
          username: username,
          roomId: props.roomid,
        });
      } else {
        console.log("Error receiving Messages");
      }
    } catch (error) {}
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setFile({
          name: selectedFile.name,
          type: selectedFile.type,
          data: reader.result,
        });
      };
    }
  };

  return (
    <div style={{ flex: 1, width: "70vw" }}>
      <div className="chat-parent-container" ref={chatContainerRef}>
        {roomItems.map((msg, index) => {
          if (msg.type === "text") {
            return (
              <ChatMessage
                key={index}
                username={msg.sender}
                time={msg.time}
                message={msg.message}
                seen={msg.seen}
                alignReverse={username === msg.sender}
              />
            );
          } else
            return (
              <FileTile
                key={index}
                file={msg.file}
                username={msg.sender}
                time={msg.time}
                seen={msg.seen}
                alignReverse={username === msg.sender}
              />
            );
        })}
        <br />
      </div>
      <div className="chat-send-message">
        <div className="input-message-div">
          <input
            className="enter-message"
            type="text"
            placeholder="Type Something "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.png,.JPEG"
            onChange={handleFileSelect}
          />
        </div>
        <br />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
        {<button onClick={populateRooms}>Check Rooms </button>}
      </div>
    </div>
  );
};

export default ChatRoom;
