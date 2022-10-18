const express = require("express");
const app = express();
const http = require("http");
const { userInfo } = require("os");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/client.html");
});

let objects = {};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("login", { id: socket.id, objects: objects });

  socket.on("onStage", (player) => {
    objects[socket.id] = player;
    socket.broadcast.emit("appear", { id: socket.id, object: player });
  });
  socket.on("move", (data) => {
    console.log(objects[socket.id].position, data.position);
    objects[socket.id].rotation = data.rotation;
    objects[socket.id].position = data.position;
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

function timer() {
  // TODO: ここで，一斉にデータ送信
  io.emit("move", objects);
}

setInterval(timer, 50);

server.listen(3000, () => {
  console.log("listening on *:3000");
});
