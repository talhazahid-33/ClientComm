import * as React from "react";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ChatTile from "./ChatList/TabTile";
import axios from "axios";
import RoomCreation from "./ChatList/usersDialog";
import ChatUsersList from "./ChatList/ChatUsers";
import socket from "../Pages/sockets";
import { useEffect } from "react";
import ChatRoom from "./Chat/chatRoom";

export default function ChatTab() {
  const [value, setValue] = React.useState();
  const [rooms, setRooms] = React.useState([]);
  const [roomID, setRoomID] = useState();
  const [usernames, setUsernames] = useState([]);
  const [roomUsername, setRoomUsername] = useState([]);
  const [activeStatus , setActiveStatus] = useState("Offline");

  const username = localStorage.getItem("username");

  const handleChange = (event, newValue) => {
    socket.emit("get_online_user",rooms[newValue].roomId);
    setValue(newValue);
    setRoomID(() => rooms[newValue].roomId);
    setRoomUsername(rooms[newValue].username);
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.roomId === rooms[newValue].roomId
          ? { ...room, newMessages: 0 }
          : room
      )
    );
  };

  const updateNewMessageCount = (roomId) => {
    console.log("Update Count : ", roomId);
    socket.emit("updateNewMessageCount",roomId);
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.roomId === roomId
          ? { ...room, newMessages: room.newMessages + 1 }
          : room
      )
    );
  };

  const createRoom = async (username2) => {
    if (!username2) return;
    try {
      const result = await axios.post("http://localhost:8000/createroom", {
        username1: username,
        username2: username2,
      });
      if (result.status === 200) {
        const roomId = result.data.roomId;
        console.log("New Room Inserted");
        const newRoom = {
          roomId: roomId,
          lastMessage: "",
          usernames: [username, username2],
        };
        setRooms((prevRooms) => [...prevRooms, newRoom]);
        socket.emit("create_room", newRoom);
      } else {
        console.log("Error creating room");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRooms = async () => {
    try {
      const result = await axios.get("http://localhost:8000/getrooms");
      if (result.status === 200) {
        console.log("Rooms : ", result.data.data);
        setRooms(result.data.data);
      } else {
        console.log("Error getting rooms");
        alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUsernames = async () => {
    try {
      const result = await axios.get("http://localhost:8000/getallusers");
      if (result.status === 200) {
        setUsernames(removeOwnUsername(result.data.data));
      } else {
        console.log("Error getting users");
        alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  function removeOwnUsername(usernames) {
    return usernames.filter((user) => user !== username);
  }

  const UpdateRoomLastMessage = (roomId, msg, open) => {
    let updatedRoomIndex = -1;
    setRooms((prevRooms) =>
      prevRooms.map((room, index) => {
        if (room.roomId === roomId) {
          updatedRoomIndex = index;
          return { ...room, lastMessage: msg, updatedAt: new Date() };
        } else return room;
      })
    );
    if (open) {
      setValue(0);
    } else if (updatedRoomIndex > value) {
      setValue(value + 1);
    } else {
      console.log("No change : ");
    }
  };
  React.useEffect(() => {
    getUsernames();
    getRooms();
  }, []);

  useEffect(() => {}, [rooms]);
  useEffect(() => {
    const handleInvitation = (data) => {
      console.log("Invitation Received", data);
      const room = {
        roomId: data.roomId,
        lastMessage: "",
        username: data.username,
      };

      socket.emit("join_room", data.roomId);
      setRooms((prevRooms) => [...prevRooms, room]);
    };

    const handleRoomLastMessage = (data) => {
      console.log("RoomLastMessage", data);
      UpdateRoomLastMessage(data.roomId, data.message);
    };

    const handleOnlineUser = (activeUser)=>{
      activeUser ? setActiveStatus("Online") : setActiveStatus("Offline");
    }

    const handleUpdateOnlineStatus = (data)=>{
      if(data.roomId === roomID){
        setActiveStatus(data.status);
      }

    }

    socket.on("invite_to_room", handleInvitation);
    socket.on("update_room_last_message", handleRoomLastMessage);
    socket.on("online_user",handleOnlineUser);
    socket.on("update_online_status",handleUpdateOnlineStatus);

    return () => {
      socket.off("invite_to_room", handleInvitation);
      socket.off("join_room");
      socket.off("update_room_last_message", handleRoomLastMessage);
      socket.off("self_room");
      socket.off("online_user",handleOnlineUser);
      socket.off("update_online_status",handleUpdateOnlineStatus);
    };
  }, [rooms]);

  return (
    <div style={{width:'100%' , padding:'5px', height:'100%' ,flexGrow:1}}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flex: 0.3 }}>
          <RoomCreation
            className="create-room"
            usernames={usernames}
            createRoom={createRoom}
          />
        </div>
        <ChatUsersList
          activeStatus = {activeStatus}
          username={!roomID ? "-1" : roomUsername}
        />
      </div>

      <Box
        sx={{
          bgcolor: "background.paper",
          display: "flex",
          height:'95%'
        }}
      >
        <Tabs
          className="tab-width"
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          {rooms
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map((room, index) => (
              <Tab
                key={index}
                sx={{ maxWidth: "100%" }}
                label={
                  <ChatTile
                    index={index}
                    username={room.username}
                    lastMessage={room.lastMessage}
                    time={room.roomId}
                    newMessages={room.newMessages}
                  />
                }
              />
            ))}
        </Tabs>
        
        <ChatRoom
          roomid={roomID}
          UpdateRoomLastMessage={UpdateRoomLastMessage}
          updateNewMessageCount={updateNewMessageCount}
        />
      </Box>
    </div>
  );
}
