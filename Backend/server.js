const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");


const controller = require("./controller");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const routes = require('./routes');
app.use('/', routes);

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
      const ids = await controller.getRoomIds(username);
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
    console.log(`Joining room: ${roomId}, Socket ID: ${socket.id}`);
    socket.join(roomId);

    //socket.to(roomId).emit("new_user_joined", { userId: socket.id });
  });

  socket.on("send_message_all", (data) => {
    console.log("Sending Message: ", data);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("create_room",(data)=>{
    console.log(socket.id ," joining room socket ",data);
    socket.join(data.roomId);
    socket.to("admin").emit("invite_to_room",data);
  })
    
  socket.on("send_message_admin", (data) => {
    console.log("Admin Sending Message: ", data);
    socket.to(data.roomId).emit("receive_message", data);
  });

  socket.on("send_message",(message)=>{
    console.log("Client sending message",message);
    controller.saveMessageFromSocket(message);
    socket.to("admin").emit("receive_message",message);
  })


  socket.on("get_rooms", () => {
    const rooms = Array.from(socket.rooms);
    console.log("Current joined rooms:", rooms);
  });

  socket.on ("update_seen_admin",(data)=>{
    console.log("Admin Updating seen",data);
    socket.to(data.roomId).emit("listen_seen_update",data);
  });

  socket.on("update_seen",(message)=>{
    console.log("Updating seen",message);
    socket.to("admin").emit("listen_seen_update",message);
  })


  socket.on("update_seen_for_all",(data)=>{
    console.log("Update senn for all server ",data);
    controller.updateSeenForAll(data.username,data.roomId);
    socket.to(data.roomId).emit("listen_update_seen_for_all",data.username);

  })

  socket.on("disconnect", (reason) => {
    console.log("Disconnected: ", socket.id, " due to ", reason);
  });


  /*socket.on("send_image", (data) => {
    io.emit("receive_image", data); // Broadcast image to all connected clients
  });
  */


  socket.on("send_image", (data) => {
    io.emit("receive_item", data); // Broadcast the text message to all clients
  });

  // Handle sending a file
  socket.on("send_file", (data) => {
    io.emit("receive_item", data); // Broadcast the file to all clients
  });
});

server.listen(8000, () => {
  console.log("Server running on port 8000");
});
