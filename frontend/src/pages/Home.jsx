import React, { useContext, useEffect } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);

  const handleLogout = () => {
    try {
      const result = fetch(`${serverUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      result.then((res) => {
        if (res.ok) {
          navigate("/signin");
          setUserData(null);
        }
      });
    } catch (error) {
      console.error("Error during logout:", error);
      setUserData(null);
      navigate("/signin");
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);
    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "calculator-open") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.calculator.net/calculator/calc${query}`,
        "_blank",
      );
    }
    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "weather-show") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=weather+${query}`, "_blank");
    }
    if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank",
      );
    }
  };

  useEffect(() => {
    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new speechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      console.log("Transcript:", transcript);

      if (
        transcript
          .toLowerCase()
          .includes(userData?.user?.assistantName.toLowerCase())
      ) {
        const data = await getGeminiResponse(transcript);
        console.log("data", data);
        handleCommand(data);
      }
    };

    recognition.start();
  }, []);

  return (
    <div className="w-full h-screen bg-linear-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-4 ">
      <button
        type="submit"
        onClick={handleLogout}
        className="min-w-37.5  h-13 bg-white px-5 py-2.5  rounded-full text-black font-semibold text-[17px] mt-2 hover:bg-white/90 transition-colors cursor-pointer absolute top-5 right-5"
      >
        Log Out
      </button>

      <button
        onClick={() => navigate("/customize")}
        type="submit"
        className="min-w-37.5 h-13 absolute top-25 px-5 py-2.5 right-5 bg-white rounded-full text-black font-semibold text-[17px] mt-2 hover:bg-white/90 transition-colors cursor-pointer"
      >
        Customize Your Assistant
      </button>

      <div className="w-75 h-100 flex justify-center items-center overflow-hidden rounded-xl shadow-lg">
        <img
          src={userData?.user?.assistantImage}
          alt="assistant"
          className="h-full object-cover"
        />
      </div>
      <h1 className="text-white text-[18px] font-semibold ">
        I'm {userData?.user?.assistantName}
      </h1>
    </div>
  );
};

export default Home;
