const { Server } = require("socket.io");
const controller = require("./Controllers/controller");
const messageController = require("./Controllers/MessageController");
let adminId;
const onlineUsers = new Map();
module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected, ID: ", socket.id);

    socket.on("selfroom", async (username) => {
      adminId = socket.id;
      try {
        console.log("Joining username: ", username);
        const ids = await controller.getRoomIds();
        console.log("Room IDs: ", ids);
        socket.join(username);
        ids.forEach((roomId) => {
          socket.join(roomId);
          console.log(`Joined room: ${roomId}`);
        });
        socket.broadcast.emit("admin_availability", adminId ? true : false);
      } catch (err) {
        console.error("Error fetching room IDs: ", err);
      }
    });

    socket.on("join_room", (roomId) => {
      console.log("Joining room: ", roomId, " Socket ID: ", socket.id);
      socket.join(roomId);
      onlineUsers.set(roomId, socket.id);
      if (socket.id !== adminId) {
        socket.to("admin").emit("update_online_status", { roomId: roomId, status: "Online" });
        io.in(roomId).emit("admin_availability", adminId ? true : false);
      }
    });

    socket.on("get_online_user", (roomId) => {
      const activeUser = onlineUsers.has(roomId);
      socket.emit("online_user", activeUser);
    });
    socket.on("admin_available", (roomId) => {
      let adminAvailable;
      if (adminId) adminAvailable = true;
      else adminAvailable = false;
      socket.to(roomId).emit("admin_availability", adminAvailable);
    });

    socket.on("create_room", (data) => {
      console.log(socket.id, " joining room socket ", data);
      socket.join(data.roomId);
      socket.to("admin").emit("invite_to_room", data);
    });


    socket.on("send_message_admin", (message) => {
      console.log("Admin Sending Message to : ", message.roomId);
      socket.to(message.roomId).emit("receive_message", message);
      console.log('Message Sent');
      
      if (message.type === "text") controller.saveMessageFromSocket(message);
      else controller.saveFileFromSocket(message);
    });

    socket.on("send_message", (message) => {
      console.log("Client sending message", message);
      if (adminId) console.log("Admin is online");
      else {
        console.log("Admin is offline");
        messageController.updateMessageCount(message.roomId, false);
      }

      if (message.type === "text") controller.saveMessageFromSocket(message);
      else controller.saveFileFromSocket(message);
      socket.to("admin").emit("receive_message", message);
    });

    socket.on("get_rooms", () => {
      console.log("getRooms");
      const rooms = Array.from(socket.rooms);
      console.log("Current joined rooms:", rooms);
    });

    socket.on("update_seen_admin", (message) => {
      console.log("Admin Updating seen", message);
      socket.broadcast.emit("listen_seen_update", message);
      controller.updateSeen(message.messageId);
    });

    socket.on("update_seen", (message) => {
      console.log("Updating seen by client ", message);
      socket.to("admin").emit("listen_seen_update", message);
      controller.updateSeen(message.messageId);
    });

    socket.on("update_seen_for_all", (data) => {
      console.log("Update seen for all client ", data);
      controller.updateSeenForAll(data.username, data.roomId);
      socket.to("admin").emit("listen_update_seen_for_all", data);
    });

    socket.on("update_seen_for_all_admin", (data) => {
      console.log("Update seen for all admin ", data);
      controller.updateSeenForAll(data.username, data.roomId);
      socket.to(data.roomId).emit("listen_update_seen_for_all", data.roomId);
      messageController.updateMessageCount(data.roomId, true);
    });

    socket.on("delete_message", (messageId) => {
      console.log("Delete Client", messageId);
      messageController.deleteMessage(messageId, "admin");
    });

    socket.on("delete_message_admin", (messageId) => {
      console.log("Delete ", messageId);
      messageController.deleteMessage(messageId, "user");
    });

    socket.on("delete_for_everyone", (messageId) => {
      console.log("Delete for Everyone", messageId);
      messageController.deleteForEveryOne(messageId);
      socket.to("admin").emit("listen_delete_message", messageId);
    });

    socket.on("delete_for_everyone_admin", (message) => {
      console.log("Delete for everyone admin", message);
      messageController.deleteForEveryOne(message.messageId);
      socket
        .to(message.roomId)
        .emit("listen_delete_message", message.messageId);
    });

    socket.on("updateNewMessageCount", (roomId) => {
      console.log("Update Message Count");
      messageController.updateMessageCount(roomId, false);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected: ", socket.id, " due to ", reason);
      try {
        if (socket.id === adminId) {
          console.log("Admin going Offline");
          adminId = null;
          socket.broadcast.emit("admin_availability", false);
        } else {
          const roomId = removeUserBySocketId(onlineUsers, socket.id);
          if (roomId !== -1) {
            console.log("User Gone Offline");
            socket.to("admin").emit("update_online_status", {
              roomId: roomId,
              status: "Offline",
            });
          } else console.log("making user Offline failed");
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("send_image", (data) => {
      socket.broadcast.emit("receive_item", data);
    });

    socket.on("send_file", (data) => {
      console.log("sending file : ", data);
      socket.broadcast.emit("receive_item", data);
      controller.saveFileFromSocket(data);
    });
  });
};

const removeUserBySocketId = (map, socketId) => {
  for (const [roomId, id] of map.entries()) {
    if (id === socketId) {
      map.delete(roomId);
      return roomId;
    }
  }
  return -1;
};
