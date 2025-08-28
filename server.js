const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (room) => {
    currentRoom = room;              // store the room for this socket
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
    socket.to(room).emit("peer-joined", socket.id);
  });


socket.on("signal", ({ room, data }) => {
    // socket.to(room).emit("signal", { data });
    socket.to(room).emit("signal", { from: socket.id, data });
});
socket.on("disconnect", () => {
      if (currentRoom) {
          socket.to(currentRoom).emit("peer-left");
      }
    //   io.to(room).emit("peer-left");
    });
});
  

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
