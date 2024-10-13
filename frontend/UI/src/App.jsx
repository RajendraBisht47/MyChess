import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Signin from "./components/Signin";
import UrlProvider from "./store/serverURL";
import { Outlet } from "react-router-dom";
import DataProvider from "./store/userData";

function App() {
  return (
    <>
      <UrlProvider>
        <DataProvider>
          <Navbar></Navbar>
          <Outlet></Outlet>
        </DataProvider>
      </UrlProvider>
    </>
  );
}

export default App;
