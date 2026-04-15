import React, { useContext } from "react";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { Routes, Route, Navigate } from "react-router-dom";
import Customize from "./pages/Customize";
import { userDataContext } from "./context/userContext";
import CustomizeName from "./pages/CustomizeName";
import Home from "./pages/Home";

const App = () => {
  const { userData } = useContext(userDataContext);
  console.log("app", userData);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.user?.assistantImage && userData?.user?.assistantName ? (
            <Home />
          ) : (
            <Navigate to={"/customize"} />
          )
        }
      />
      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to="/" />}
      />
      <Route
        path="/signin"
        element={!userData ? <Signin /> : <Navigate to="/" />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/signin" />}
      />
      <Route
        path="/customize-name"
        element={userData ? <CustomizeName /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
};

export default App;
