import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ChatMessage from "./chatTile";
import socket from "../../Pages/sockets";
import { v4 as uuid } from "uuid";
import FileTile from "./fileTile";
import FileInput from "./FileInput";
import { useSelector } from "react-redux";
import { selectMessagesByRoomId } from "../../Redux/messagesSlice";
import VideoTile from "./videoTile";

const ChatRoom = (props) => {
  const [message, setMessage] = useState("");
  const [fileType, setFileType] = useState(null);
  const [roomItems, setRoomItems] = useState([]);
  const [roomID, setRoomID] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");
  const chatContainerRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    if (messageRef.current) {
      messageRef.current.focus();
    }
  }, [roomItems]);

  useEffect(() => {
    getRoomItems();
    //console.log("Ret Msgs : ",messages);
    //setRoomItems(messages);
    console.log("Room ID : ", props.roomid);
    setRoomID(props.roomid);
  }, [props.roomid]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("Msg Received");
      //console.log("receiving socket Message ", data.roomId,props.roomid,roomID);
      //console.log(roomID== data.roomId);

      if (data.roomId === props.roomid) {
        console.log("Calling Update Seen");
        socket.emit("update_seen_admin", data);
        setRoomItems((prevItems) => [...prevItems, data]);
      } else {
        console.log("Message belongs to room ", data.roomId);
        props.updateNewMessageCount(data.roomId);
      }
    };

    const handleSeenUpdate = (data) => {
      console.log("handleSeenUpdate ", data);
      setRoomItems((prevMessages) =>
        prevMessages.map((message) =>
          message.messageId == data.messageId
            ? { ...message, seen: true }
            : message
        )
      );
    };

    const handleSeenUpdateForAll = (data) => {
      console.log("Handle seen update for All", data);
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
  }, [roomItems, props.roomid]);

  const getRoomItems = async () => {
    try {
      const result = await axios.post("http://localhost:8000/getmessages", {
        roomId: props.roomid,
      });
      if (result.status === 200) {
        console.log(result.data);
        setRoomItems(result.data.data);
        socket.emit("update_seen_for_all", {
          username: username,
          roomId: props.roomid,
        });
      } else {
        console.log("DB status Error in getRoomItems");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return now.toLocaleTimeString("en-US", options);
  };

  const sendMessage = async () => {
    const time = getCurrentTime();
    try {
      if (selectedFile) {
        const path = await uploadFile();

        console.log("Path : ", path);
        const newMessage = {
          messageId: uuid(),
          sender: username,
          seen: false,
          roomId: props.roomid,
          fileType: selectedFile.type,
          message: null,
          name: selectedFile.name,
          data: path.replace(/\\/g, "/"),
          time: time,
          type: fileType,
        };
        setRoomItems((prevItems) => [...prevItems, newMessage]);
        console.log("file : ", selectedFile);
        socket.emit("send_message_admin", newMessage);
        props.UpdateRoomLastMessage(props.roomid, selectedFile.name);
        setSelectedFile(null);
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
        data: null,
        fileType: null,
        name: null,
      };
      socket.emit("send_message_admin", newMessage);
      setRoomItems((prevItems) => [...prevItems, newMessage]);
      props.UpdateRoomLastMessage(props.roomid, newMessage.message);
      setMessage("");
    } catch (error) {
      console.log("Error sending Message");
    }
  };

  const handleSelectedFile = (type, file) => {
    setSelectedFile(file);
    setFileType(type);
  };
  const uploadFile = async () => {
    if (!selectedFile) {
      console.log("Empty File");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios.post(
        "http://localhost:8000/uploadimage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.filePath;
    } catch (error) {
      console.log("Error uploading file: " + error.message);
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
                path={msg.data}
                type={msg.type}
                username={msg.sender}
                name={msg.name}
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
            ref={messageRef}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          ></input>
          <FileInput handleSelectedFile={handleSelectedFile} />
        </div>
        <br />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
        {
          <button
            onClick={() => {
              console.log(props.roomid);
            }}
          >
            Check Rooms{" "}
          </button>
        }
      </div>
    </div>
  );
};
export default ChatRoom;
