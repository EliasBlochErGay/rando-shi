const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let devId = null;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  if (!devId) {
    devId = socket.id;
    console.log("Dev assigned:", devId);
    socket.emit("role", "dev");
  } else {
    socket.emit("role", "user");
    socket.emit("dev-id", devId);

    // Notify dev of new user
    io.to(devId).emit("new-user", socket.id);
  }

  socket.on("offer", (data) => {
    if (devId) io.to(devId).emit("offer", { from: socket.id, sdp: data.sdp });
  });

  socket.on("answer", (data) => {
    io.to(data.to).emit("answer", { sdp: data.sdp, from: socket.id });
  });

  socket.on("ice-candidate", (data) => {
    io.to(data.to).emit("ice-candidate", { candidate: data.candidate, from: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Notify dev of disconnected user
    if (socket.id !== devId && devId) {
      io.to(devId).emit("user-disconnected", socket.id);
    }

    if (socket.id === devId) {
      devId = null;
      console.log("Dev left, next user to connect will become dev.");
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
