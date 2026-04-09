import React from "react";
import { userDataContext } from "./userContext";

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:3000";
  const value = { serverUrl };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
