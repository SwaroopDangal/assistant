import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext.js";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { serverUrl } = useContext(userDataContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const response = await fetch(`${serverUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      console.log("Signup successful", data);
      navigate("/signin");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred during signup",
      );
      console.error("Signup error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSignup}
        className="w-[90%] max-w-120 bg-[#00000062] backdrop-blur-xl rounded-2xl flex flex-col items-center justify-center gap-5 px-8 py-10 border border-white/10 shadow-2xl"
      >
        <h1 className="text-white text-[26px] font-semibold mb-2 text-center">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          value={name}
          placeholder="Enter your Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full h-13 outline-none border border-white/55 bg-transparent text-white placeholder-white/50 px-5 rounded-full text-[16px] focus:border-white/80 transition-colors"
        />

        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Email"
          className="w-full h-13 outline-none border border-white/55 bg-transparent text-white placeholder-white/50 px-5 rounded-full text-[16px] focus:border-white/80 transition-colors"
        />

        <div className="w-full relative h-13 border border-white/55 bg-transparent rounded-full flex items-center focus-within:border-white/80 transition-colors">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full h-full rounded-full outline-none bg-transparent text-white placeholder-white/50 px-5 text-[16px]"
          />
          {!showPassword ? (
            <IoEye
              className="absolute top-1/2 -translate-y-1/2 right-5 text-white/70 w-6 h-6 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <IoEyeOff
              className="absolute top-1/2 -translate-y-1/2 right-5 text-white/70 w-6 h-6 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>
        {error && error.length > 0 && (
          <p className="text-red-500 text-[18px]">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="min-w-37.5 h-13 bg-white rounded-full text-black font-semibold text-[17px] mt-2 hover:bg-white/90 transition-colors cursor-pointer"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p
          onClick={() => navigate("/signin")}
          className="text-[15px] cursor-pointer text-white"
        >
          Already have an account?{" "}
          <span className="text-blue-400">Sign In</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
