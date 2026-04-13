import React, { useContext } from "react";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import Card from "../components/Card";
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const navigate = useNavigate();
  const {
    frontendImage,
    setFrontendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);
  const inputImage = React.useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full h-screen bg-linear-to-t from-black to-[#030353] flex justify-center items-center flex-col p-5">
      <h1 className="text-white mb-10 text-[30px] text-center">
        Select Your <span className="text-blue-200">Assistant Image</span>
      </h1>
      <div className="w-full max-w-225 flex justify-center items-center flex-wrap gap-4">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div
          className={`w-17.5 h-35 lg:w-40 lg:h-62.5 bg-[#020220] border-2 border-[#0000ff66] rounded-2xl hover:shadow-2xl hover:shadow-blue-950 cursor-pointer over:border-4 hover:border-white flex items-center justify-center ${selectedImage === "input" ? "border-white border-4 shadow-2xl shadow-blue-950" : ""} `}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {frontendImage ? (
            <img
              src={frontendImage}
              alt="assistant"
              className="h-full object-cover"
            />
          ) : (
            <RiImageAddLine className="text-white w-6.25 h-6.25" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputImage}
          onChange={handleImage}
        />
      </div>
      {selectedImage && (
        <button
          onClick={() => navigate("/customize-name")}
          className="min-w-37.5  h-13 bg-white rounded-full text-black font-semibold text-[17px] mt-2 hover:bg-white/90 transition-colors cursor-pointer"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Customize;
