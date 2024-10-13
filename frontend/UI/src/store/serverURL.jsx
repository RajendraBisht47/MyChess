import { useState, createContext } from "react";

export const Context = createContext();

function UrlProvider({ children }) {
  const [url, seturl] = useState("http://localhost:8001");

  return <Context.Provider value={url}>{children}</Context.Provider>;
}

export default UrlProvider;
