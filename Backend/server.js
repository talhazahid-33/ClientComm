const express = require("express");
const cors = require("cors");
const path = require('path')
const http = require("http");
const { Server } = require("socket.io");

const controller = require("./Controllers/controller");
const messageController = require('./Controllers/MessageController');

const app = express();
const server = http.createServer(app);

app.use(cors());
const bodyParser = require("body-parser");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); 
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 




const routes = require("./routes");
app.use("/", routes);
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

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
    try {
      console.log("Joining username: ", username);
      const ids = await controller.getRoomIds();
      console.log("Room IDs: ", ids);
      socket.join(username);
      ids.forEach((roomId) => {
        socket.join(roomId);
        console.log(`Joined room: ${roomId}`);
      });
    } catch (err) {
      console.error("Error fetching room IDs: ", err);
    }
  });

  socket.on("join_room", (roomId) => {
    console.log("Joining room: " , roomId," Socket ID: " ,socket.id);
    socket.join(roomId);

    //socket.to(roomId).emit("new_user_joined", { userId: socket.id });
  });

  socket.on("send_message_all", (data) => {
    console.log("Sending Message: ", data);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("create_room", (data) => {
    console.log(socket.id, " joining room socket ", data);
    socket.join(data.roomId);
    socket.to("admin").emit("invite_to_room", data);

  });

  socket.on("send_message_admin", (message) => {
    console.log("Admin Sending Message to : ", message.roomId);
    socket.to(message.roomId).emit("receive_message", message);
    
    if (message.type === "text") controller.saveMessageFromSocket(message);
    else controller.saveFileFromSocket(message);
  });

  socket.on("send_message", (message) => {
    console.log("Client sending message", message);
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
    console.log("Update senn for all client ", data);
    controller.updateSeenForAll(data.username, data.roomId);
    socket.to("admin").emit("listen_update_seen_for_all", data);
  });

  socket.on("update_seen_for_all_admin", (data) => {
    console.log("Update senn for all admin ", data);
    controller.updateSeenForAll(data.username, data.roomId);
    socket.to(data.roomId).emit("listen_update_seen_for_all", data.roomId);
  });

  socket.on("delete_message",(messageId)=>{
    console.log("Delete ",messageId);
    //messageController.deleteMessage(messageId);
    messageController.deleteForEveryOne(messageId);
    socket.to("admin").emit("listen_delete_message",messageId);
  })
  socket.on("delete_message_admin",(message)=>{
    console.log("Delete ",message);
    messageController.deleteMessage(message.messageId);
    socket.to(message.roomId).emit("listen_delete_message",message.messageId);
  })

  socket.on("delete_message",(data)=>{
    console.log("Delete ");

  })







  socket.on("disconnect", (reason) => {
    console.log("Disconnected: ", socket.id, " due to ", reason);
  });

  socket.on("send_image", (data) => {
    socket.broadcast.emit("receive_item", data);
  });

  

  // Handle sending a file
  socket.on("send_file", (data) => {
    console.log("sending file : ", data);
    socket.broadcast.emit("receive_item", data);
    //controller.saveFiles(data);
    controller.saveFileFromSocket(data);
  });
});

server.listen(8000, () => {
  console.log("Server running on port 8000");
});
