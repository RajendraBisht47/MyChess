import { useContext, useEffect, useState } from "react";
import { socket } from "./Home";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for redirection
import "./css/Game.css";
import { ContextUser } from "../store/userData";

function Game() {
  const { room, data } = useContext(ContextUser);
  const [color, setColor] = useState("black");
  const [step, setStep] = useState(2);
  const [holdpiece, setholdpiece] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For redirection

  const initialBoard = [
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
  ];

  const [board, setBoard] = useState(initialBoard);

  useEffect(() => {
    if (!room || !data) {
      setError("You will leave the game");
    } else if (room.chance === data.username) {
      setColor("white");
    }
  }, [room, data]);

  useEffect(() => {
    socket.on("nextmove1", (obj) => {
      if (obj.sender !== socket.id) {
        setBoard(obj.board);
        setStep(2);
      }
    });

    socket.on("connect_error", () => {
      setError("Connection error");
    });

    socket.on("disconnect", () => {
      setError("Disconnected from server");
    });

    return () => {
      socket.off("nextmove1");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if (error) {
      alert(error);
      navigate("/");
    }
  }, [error, navigate]);

  function hold(i, j) {
    setholdpiece(board[i][j]);
    board[i][j] = null;
    setBoard([...board]);
  }

  function drop(i, j) {
    board[i][j] = holdpiece;
    setBoard([...board]);
    socket.emit("nextmove", { board, sender: socket.id, roomName: room.room });
  }

  return (
    <div className="chessBoardcontainer">
      <h1>MyChess</h1>
      <h3>Your color: {color}</h3>
      <div className="chessBoard">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`square ${
                (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
              }`}
              onClick={() => {
                if (step === 2) {
                  hold(rowIndex, colIndex);
                  setStep(1);
                } else if (step === 1) {
                  drop(rowIndex, colIndex);
                  setStep(0);
                }
              }}
            >
              {piece && (
                <img
                  src={`../public/pieces/${piece}.png`}
                  alt=""
                  className="piece"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Game;
