import React from "react";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { Routes, Route } from "react-router-dom";
import Customize from "./pages/Customize";

const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/customize" element={<Customize />} />
    </Routes>
  );
};

export default App;
