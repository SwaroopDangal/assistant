import React, { useContext, useEffect } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import ai from "../assets/ai.gif";
import userImg from "../assets/user.gif";
const Home = () => {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const [userText, setUserText] = React.useState("");
  const [aiText, setAiText] = React.useState("");

  const [listening, setListening] = React.useState(false);
  const isSpeakingRef = React.useRef(false);
  const recognitionRef = React.useRef(null);
  const synth = window.speechSynthesis;
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

  const startRecognition = () => {
    try {
      recognitionRef?.current?.start();
      setListening(true);
    } catch (error) {
      console.error("Error starting recognition:", error);
    }
  };

  useEffect(() => {
    const speak = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find((voice) => voice.lang.includes("en"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      synth.speak(utterance);
      isSpeakingRef.current = true;
      utterance.onend = () => {
        isSpeakingRef.current = false;
        startRecognition();
      };
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
        window.open(
          `https://www.google.com/search?q=weather+${query}`,
          "_blank",
        );
      }
      if (type === "youtube-search" || type === "youtube-play") {
        const query = encodeURIComponent(userInput);
        window.open(
          `https://www.youtube.com/results?search_query=${query}`,
          "_blank",
        );
      }
    };

    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new speechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;
    const isRecognizingRef = { current: false };

    const safeRecognition = () => {
      try {
        if (!isSpeakingRef.current && !isRecognizingRef.current) {
          recognition.start();
        }
      } catch (error) {
        console.error("Error during recognition:", error);
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };
    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error === "aborted" && !isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      console.log("Transcript:", transcript);

      if (
        transcript
          .toLowerCase()
          .includes(userData?.user?.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        setUserText("");
        setAiText(data.response);
        console.log("data", data);
        if (data && data.response) {
          handleCommand(data);
        }
      }
    };

    safeRecognition();

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 10000);

    return () => {
      clearInterval(fallback);
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
    };
  }, [userData?.user?.assistantName, getGeminiResponse, setListening, synth]);

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
      {!aiText && (
        <img src={userImg} alt="User" className="object-cover h-50 w-100" />
      )}
      {aiText && (
        <img src={ai} alt="AI" className="h-full object-cover w-100 h-50" />
      )}
    </div>
  );
};

export default Home;
