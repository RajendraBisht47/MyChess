import { useState, createContext } from "react";

export const Context = createContext();

function UrlProvider({ children }) {
  const [url, seturl] = useState("https://mychess-x9y2.onrender.com");

  return <Context.Provider value={url}>{children}</Context.Provider>;
}

export default UrlProvider;
