import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Signin from "./components/Signin.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import OnlinePlayers from "./components/OnlinePlayers.jsx";
import Game from "./components/Game.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      { path: "/", element: <Home></Home> },
      { path: "/signin", element: <Signin></Signin> },
      { path: "/login", element: <Login></Login> },
      { path: "/onlineplayer", element: <OnlinePlayers></OnlinePlayers> },
      { path: "/game", element: <Game></Game> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
