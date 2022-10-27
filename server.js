const express = require("express");
const app = express();
const http = require("http");
const { userInfo } = require("os");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");
const csv = require("csv");

app.use(express.static("public"));

app.get("/gm", (req, res) => {
  fs.createReadStream(__dirname + "/public/assets/map/map1.csv").pipe(
    csv.parse((err, map) => {
      fs.readFile(__dirname + "/public/view/gm.html", "utf-8", (err, html) => {
        if (err) throw err; // 例外発生時の処理
        const replaceMap = html.replace("'%%MAP%%'", JSON.stringify(map));
        res.end(replaceMap);
      });
    })
  );
});

app.get("/", (req, res) => {
  fs.createReadStream(__dirname + "/public/assets/map/map1.csv").pipe(
    csv.parse((err, map) => {
      fs.readFile(
        __dirname + "/public/view/client.html",
        "utf-8",
        (err, html) => {
          if (err) throw err; // 例外発生時の処理
          const replaceMap = html.replace("'%%MAP%%'", JSON.stringify(map));
          let playerType = "player";
          if (req.query.type && req.query.type === "gm") playerType = "gm";
          const content = replaceMap.replace(
            "'%%USER_TYPE%%'",
            "'" + playerType + "'"
          );
          res.end(content);
        }
      );
    })
  );
});

app.get("/solo", (req, res) => {
  res.sendFile(__dirname + "/public/view/index.html");
});
app.get("/phone", (req, res) => {
  res.sendFile(__dirname + "/public/view/smartphone.html");
});

let objects = {};
let colorIndex = 0;

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("login", { id: socket.id, objects: objects, color: colorIndex });
  colorIndex = ++colorIndex % 4;

  socket.on("onStage", (player) => {
    objects[socket.id] = player;
    // socket.broadcast.emit("appear", { id: socket.id, object: player });
    socket.broadcast.emit("appear", { id: socket.id, object: player });
  });
  socket.on("move", (data) => {
    objects[socket.id].rotation = data.rotation;
    objects[socket.id].position = data.position;
    objects[socket.id].color = data.color;
  });
  socket.on("changeColor", (data) => {
    console.log("changeColor: " + data.color);
    objects[data.id].color = data.color;
  });
  // おそらくえらいこっちゃになる。
  socket.on("weapon", (arm) => {
    socket.broadcast.emit("weapon", { id: socket.id, arm: arm });
  });
  socket.on("disconnect", () => {
    delete objects[socket.id];
    console.log("user disconnected");
  });
  socket.on("start", (data) => {
    socket.broadcast.emit("start", data);
  });
  socket.on("finish", (data) => {
    socket.broadcast.emit("finish", data);
  });
});

// TODO: 床を塗った情報はどうする？あと玉，壁の共有はCSVかなんかで実現？
function timer() {
  // TODO: ここで，一斉にデータ送信
  io.emit("move", objects);
}

setInterval(timer, 50);

server.listen(3000, () => {
  console.log("listening on *:3000");
});
