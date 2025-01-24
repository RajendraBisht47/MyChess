import { useContext, useEffect, useState } from "react";
import { ContextUser } from "../store/userData";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./css/Home.css";

export const socket = io("http://localhost:8001");

function Home() {
  const { data, getUserData, room, setRoom } = useContext(ContextUser);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [toast, setToast] = useState(false);
  useEffect(() => {
    const userData = getUserData();
    setUser(userData);

    if (!userData) {
      navigate("/login");
    }
  }, [data, navigate]);

  useEffect(() => {
    if (user) {
      socket.emit("register", user.username);
    }

    return () => {};
  }, [user]);

  useEffect(() => {
    socket.on("invitation", (obj) => {
      setToast(true);
      setInvite(obj);
    });
  }, []);

  function accepted(inv) {
    socket.emit("startGame", {
      oponentName: inv.oponentName,
      oponentKey: inv.oponentKey,
      acceptedKey: socket.id,
    });
    setToast(false);
  }

  useEffect(() => {
    socket.on("gameStarted", (mess) => {
      //console.log(mess);
      if (mess) {
        setRoom(mess);
        navigate("/game");
      }
    });
  }, []);

  return (
    <div className="maincontainer">
      {invite !== null && toast ? (
        <div
          className="alert alert-success"
          role="alert"
          id="toast"
          style={{ marginTop: "20px" }}
        >
          <small>{`${invite.oponentName} is Inviting you`}</small>
          <button
            type="button"
            className=" close"
            onClick={() => {
              setToast(false);
            }}
          >
            <img src="/reject.png" alt="" height="30px" />
          </button>
          <button
            type="button"
            className=" close"
            onClick={() => {
              accepted(invite);
            }}
          >
            <img src="/accept.png" alt="" height="30px" />
          </button>
        </div>
      ) : null}
      <Link className="containerBox" to={"/onlineplayer"}>
        <div className="card  componnet1">
          <div className="componnet">
            <div className="col-md-4">
              <img
                style={{
                  margin: "5px",
                  height: "100px",
                  width: "100px",
                }}
                src="/friend.png"
                className="img-fluid rounded-start"
                alt="Invite Friend"
              />
            </div>
            <div className="col-md-8 d-flex justify-content-center align-items-center">
              <div className="card-body">
                <h5 className="card-title">Invite Friend</h5>
                <p className="card-text">Choose your opponent</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <Link className="containerBox" to={"/gameonline"}>
        <div className="card componnet1">
          <div className="componnet">
            <div className="col-md-4">
              <img
                style={{
                  height: "100px",
                  width: "100px",
                }}
                src="/random.jpg"
                className="img-fluid rounded-start"
                alt="Play Online"
              />
            </div>
            <div className="col-md-8 d-flex justify-content-center align-items-center">
              <div className="card-body">
                <h5 className="card-title">Play Online</h5>
                <p className="card-text">Play with random.</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Home;
