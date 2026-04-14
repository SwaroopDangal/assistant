import React, { useContext, useState } from "react";
import { userDataContext } from "../context/userContext";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CustomizeName = () => {
  const { userData, serverUrl, backendImage, selectedImage, setUserData } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || "",
  );

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await fetch(`${serverUrl}/api/user/update-assistant`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      const data = await result.json();
      console.log(data);
      if (!result.ok) {
        throw new Error(data.message || "Update failed");
      }
      setUserData(data);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen bg-linear-to-t from-black to-[#030353] flex justify-center items-center flex-col p-5">
      <MdKeyboardBackspace
        onClick={() => navigate("/customize")}
        className="absolute text-white cursor-pointer top-7.5 left-7.5 w-6.25 h-6.25"
      />
      <h1 className="text-white mb-10 text-[30px] text-center">
        Select Your <span className="text-blue-200">Assistant Name</span>
      </h1>
      <input
        type="text"
        value={assistantName}
        placeholder="Enter Your Assistant Name"
        onChange={(e) => setAssistantName(e.target.value)}
        className="w-full max-w-150 h-13 outline-none border border-white/55 bg-transparent text-white placeholder-white/50 px-5 rounded-full text-[16px] focus:border-white/80 transition-colors"
      />
      {assistantName && (
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="min-w-75  h-13 bg-white rounded-full text-black font-semibold text-[17px] mt-2 hover:bg-white/90 transition-colors cursor-pointer"
        >
          {loading ? "Creating..." : "Create Your Assistant"}
        </button>
      )}
    </div>
  );
};

export default CustomizeName;
