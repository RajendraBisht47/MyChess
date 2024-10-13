import { useState, createContext } from "react";

export const ContextUser = createContext();

function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem("userData");
      if (savedData === undefined) return null;
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      return null;
    }
  });

  function setUserData(user) {
    setData(user);
    localStorage.setItem("userData", JSON.stringify(user));
  }

  function getUserData() {
    try {
      const savedData = localStorage.getItem("userData");
      if (savedData === undefined) return null;

      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      return null;
    }
  }

  function deleteUserData() {
    setData(null);
    localStorage.removeItem("userData");

    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    window.location.href = "/login";
  }

  const [room, setRoom] = useState(null);
  return (
    <ContextUser.Provider
      value={{ data, setUserData, getUserData, deleteUserData, room, setRoom }}
    >
      {children}
    </ContextUser.Provider>
  );
}

export default DataProvider;
