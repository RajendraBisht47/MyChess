require("dotenv").config();

const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookiesParser = require("cookie-parser");

//queue
var onlineUsers = {};
//

//db
const { connectDB } = require("./controllers/connectDB");
//end

//authentication
const auth = require("./authentication/auth");
//end

//routes
const userRoutes = require("./routes/user");
//end

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://mychess-mj02.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
//conneting to DB
connectDB();
//end

//Socket management
io.on("connection", (socket) => {
  //console.log(socket.id);

  socket.on("register", (message) => {
    onlineUsers[socket.id] = message;
    // console.log("new user " + message, socket.id);
    // console.log("totaluser ", onlineUsers);
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    // console.log("deleted user " + socket.id);
  });

  socket.on("getOnlineUsers", () => {
    io.emit("onlineuser", { onlineUsers });
  });

  socket.on("inviteFriend", (obj) => {
    io.to(obj.key).emit("invitation", {
      oponentKey: socket.id,
      oponentName: obj.username,
    });
  });

  socket.on("startGame", (obj) => {
    const accept = socket.id;
    const request = obj.oponentKey;
    const roomName = `room-${accept}-${request}`;
    socket.join(roomName);
    io.to(request).socketsJoin(roomName);

    io.to(roomName).emit("gameStarted", {
      room: roomName,
      players: {
        player1: {
          id: accept,
          name: onlineUsers[accept],
        },
        player2: {
          id: request,
          name: onlineUsers[request],
        },
      },
      chance: onlineUsers[accept],
    });
  });

  socket.on("nextmove", (obj) => {
    roomName = obj.roomName;
    io.to(roomName).emit("nextmove1", {
      board: obj.board,
      sender: obj.sender,
    });
  });
});
//end

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: `${process.env.UI_URL}`,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser());
//end

app.get("/", auth, (req, res) => {});

app.use("/user", userRoutes);

server.listen(process.env.PORT || 8001, () => {
  console.log("Server Started");
});
