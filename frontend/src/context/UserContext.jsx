import React, { useEffect, useState } from "react";
import { userDataContext } from "./userContext";

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:3000";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = React.useState(null);
  const [backendImage, setBackendImage] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/user/current`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          console.log("User data fetched:", data);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      } 
    };

    fetchUser();
  }, []);

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
