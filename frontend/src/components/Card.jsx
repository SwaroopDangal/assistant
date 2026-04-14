import React, { useContext } from "react";
import { userDataContext } from "../context/userContext";

const Card = ({ image }) => {
  const { selectedImage, setSelectedImage, setBackendImage, setFrontendImage } =
    useContext(userDataContext);
  return (
    <div
      className={`w-17.5 h-35 lg:w-40 lg:h-62.5 bg-[#020220] border-2 border-[#0000ff66] rounded-2xl hover:shadow-2xl hover:shadow-blue-950 cursor-pointer over:border-4 hover:border-white ${selectedImage === image ? "border-white border-4 shadow-2xl shadow-blue-950" : ""} `}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img src={image} alt="assistant" className="h-full object-cover" />
    </div>
  );
};

export default Card;
