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
  const [selectedFile, setSelectedFile] = useState();
  const [selectedFileName, setSelectedFileName] = useState("");

  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");
  const chatContainerRef = useRef(null);
  const messageRef = useRef(null);

  const messages = useSelector((state) =>
    selectMessagesByRoomId(state, props.roomid)
  );
  const msgs = useSelector((state) => state.messages);

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
    //console.log("Ret Msgs : ", messages);
    //console.log("Msgs : ", msgs);
    //setRoomItems(messages);
    setRoomID(props.roomid);
  }, [props.roomid]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("Msg Received");
      if (data.roomId === props.roomid) {
        if (data.message)
          props.UpdateRoomLastMessage(data.roomId, data.message, true);
        else props.UpdateRoomLastMessage(data.roomId, data.name, true);

        console.log("Calling Update Seen");
        socket.emit("update_seen_admin", data);
        setRoomItems((prevItems) => [...prevItems, data]);
      } else {
        console.log("Message belongs to room ", data.roomId);
        if (data.message)
          props.UpdateRoomLastMessage(data.roomId, data.message, false);
        else props.UpdateRoomLastMessage(data.roomId, data.name, false);

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
      if (data.roomId === props.roomid) {
        setRoomItems((prevRoomItems) =>
          prevRoomItems.map((message) =>
            message.sender !== data.username
              ? { ...message, seen: true }
              : message
          )
        );
      }
    };
    const handleDeleteMessage = (messageId) => {
      console.log("Handle Delete message", messageId);
      // setRoomItems((prevRoomItems) => {
      //   return prevRoomItems.filter((item) => item.messageId !== messageId);
      // });
      setRoomItems((prevRoomItems) =>
        prevRoomItems.map((message) =>
          message.messageId !==messageId
            ? { ...message, message: "This message was deleted" , type:'text' }
            : message
        )
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("listen_seen_update", handleSeenUpdate);
    socket.on("listen_update_seen_for_all", handleSeenUpdateForAll);
    socket.on("listen_delete_message", handleDeleteMessage);
    socket.on("receive_item", (data) => {
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
        setRoomItems(result.data.data);
        socket.emit("update_seen_for_all_admin", {
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
        socket.emit("send_message_admin", newMessage);
        props.UpdateRoomLastMessage(props.roomid, selectedFile.name);
        setSelectedFile(null);
        setSelectedFileName("");
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
      props.UpdateRoomLastMessage(props.roomid, newMessage.message, true);
      setMessage("");
    } catch (error) {
      console.log("Error sending Message");
    }
  };

  const handleSelectedFile = (type, file) => {
    setSelectedFile(file);
    setSelectedFileName(file.name);
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
        "http://localhost:8000/uploadfile",
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
  function truncateString(str) {
    return str.length > 20 ? str.substring(0, 20) + "..." : str;
  }
  const deleteMessage = (index) => {
    console.log("Lets delete ", index);
    const message = roomItems[index];
    setRoomItems((prevItems) => {
      return prevItems.filter((_, i) => i !== index);
    });
    socket.emit("delete_message_admin", message);
  };
  return (
    <div style={{ flex: 1, width: "70vw" }}>
      <div className="chat-parent-container" ref={chatContainerRef}>
        {roomItems.map((msg, index) => {
          if (msg.type === "text") {
            return (
              <ChatMessage
                index={index}
                username={msg.sender}
                time={msg.time}
                message={msg.message}
                seen={msg.seen}
                alignReverse={username === msg.sender}
                deleteMessage={deleteMessage}
              />
            );
          } else if (msg.type === "video") {
            return (
              <>
                <VideoTile
                  message={msg}
                  alignReverse={username === msg.sender}
                />
              </>
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
          {selectedFileName && (
            <p style={{ marginTop: "15px", fontSize: "10px" }}>
              {truncateString(selectedFileName)}
            </p>
          )}
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
