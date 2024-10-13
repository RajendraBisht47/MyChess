import { useEffect, useState } from "react";
import { socket } from "./Home";
import "./css/OnlinePlayers.css";

function OnlinePlayers() {
  const [onlineUser, setUser] = useState([]);

  useEffect(() => {
    socket.emit("getOnlineUsers");

    socket.on("onlineuser", (data) => {
      // console.log(data);
      setUser(data.onlineUsers);
    });

    return () => {
      socket.off("onlineuser");
    };
  }, []);

  function invite(key) {
    socket.emit("inviteFriend", { key, username: onlineUser[socket.id] });
  }

  return (
    <div className="maincontainer1">
      <h4 className="header">Online Users</h4>

      {Object.keys(onlineUser).map((key) =>
        key === socket.id ? null : (
          <div key={key} className="invite">
            <h4>{onlineUser[key]}</h4>{" "}
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                invite(key);
              }}
            >
              Invite
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default OnlinePlayers;
