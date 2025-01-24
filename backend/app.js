require("dotenv").config();

const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookiesParser = require("cookie-parser");

//queue
var onlineUsers = {};
var onlineUsers1 = [];

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
//"https://mychess-mj02.onrender.com"
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

  //onlineGames
  socket.on("onlinegame", (e) => {
    onlineUsers1.push([e.id, e.username]);
    // console.log(onlineUsers1);
    if (onlineUsers1.length >= 2) {
      const user1 = onlineUsers1.pop();
      const user2 = onlineUsers1.pop();

      const accept = user1[0];
      const request = user2[0];
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
    }
  });
  //end
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

app.use("/user", userRoutes);

server.listen(process.env.PORT || 8001, () => {
  console.log("Server Started");
});
