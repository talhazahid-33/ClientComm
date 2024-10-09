import * as React from "react";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ChatTile from "./ChatList/TabTile";
import axios from "axios";
import TabPanelC from "./ChatList/TabPanel";
import RoomCreation from "./ChatList/usersDialog";
import ChatUsersList from "./ChatList/ChatUsers";
import socket from "../Pages/sockets";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { populateRooms, printRooms } from "../Redux/RoomsSlice";
import ChatRoom from "./Chat/chatRoom";

export default function ChatTab() {
  const [value, setValue] = React.useState(0);
  const [rooms, setRooms] = React.useState([]);
  const [roomID, setRoomID] = useState();
  const [usernames, setUsernames] = useState([]);
  const [roomUsername, setRoomUsername] = useState([]);

  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");
  const dispatch = useDispatch();
  //const selector = useSelector();

  const handleChange = (event, newValue) => {
    console.log("New Value : ", newValue);
    setValue(newValue);
    setRoomID(() => rooms[newValue].roomId);
    setRoomUsername(rooms[newValue].username);
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.roomId == rooms[newValue].roomId
          ? { ...room, newMessages: 0 }
          : room
      )
    );
  };

  const updateNewMessageCount = (roomId) => {
    console.log("Update Count : ", roomId);
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.roomId == roomId
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

  const getCurrentSqlTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

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

    socket.on("invite_to_room", handleInvitation);
    socket.on("update_room_last_message", handleRoomLastMessage);

    return () => {
      socket.off("invite_to_room", handleInvitation);
      socket.off("join_room");
      socket.off("update_room_last_message", handleRoomLastMessage);
      socket.off("self_room");
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
          room={rooms}

          username={!rooms ? "[Hamza , ALi]" : roomUsername}
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
        {/*
        <TabPanelC
          value={value}
          roomid={roomID}
          UpdateRoomLastMessage={UpdateRoomLastMessage}
          updateNewMessageCount={updateNewMessageCount}
          moveRoomToStart={moveRoomToStart}
        ></TabPanelC>*/}
        <ChatRoom
          roomid={roomID}
          UpdateRoomLastMessage={UpdateRoomLastMessage}
          updateNewMessageCount={updateNewMessageCount}
        />
      </Box>
    </div>
  );
}
