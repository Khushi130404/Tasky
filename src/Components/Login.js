// #f3eeeate second bg 
// #fdf6f0 white bg 
// #fa823e orange
// #f5766f pink
// #ffc11e yellow
// #309a42 green

import React, { useState } from "react";
import { realDb } from "../firebase";
import { ref, get, child } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const dbRef = ref(realDb);
    get(child(dbRef, "users"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          const userKey = Object.keys(users).find((key) => {
            const user = users[key];
            return (
              user.username === usernameOrEmail ||
              user.email === usernameOrEmail
            );
          });

          if (userKey) {
            const user = users[userKey];
            if (user.password === password) {
              localStorage.setItem("userId", userKey);
              navigate("/MyActivity");
            } else {
              setError("Incorrect password, Enter password properly.");
            }
          } else {
            setError("User not found.");
          }
        } else {
          setError("No users found in the database.");
        }
      })
      .catch(() => {
        setError("Login failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf8f5]">
      <div className="flex flex-col md:flex-row w-full max-w-7xl shadow-xl drop-shadow-xl rounded-3xl  overflow-hidden bg-white ">

        {/* Left Section */}
        <div className="flex-1 bg-[#f0f5fc] text-white flex flex-col rounded-3xl items-center justify-center p-8 order-1 md:order-1">
          <h2 className="text-5xl font-bold mb-4 mt-7 text-black">Welcome back !!</h2>
          <p className="text-3xl  font-bold text-center text-[#f5766f]">Let's stay on track!</p>
          <img
            src="/tt4.png"
            alt="Animated Graphic"
            className="w-4/4"
          />
        </div>

        {/* Right Section */}
        <div className="flex-1 p-8 bg-[#ffffff] order-2 md:order-2  rounded-3xl ">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-5xl font-bold text-gray-800 text-center mb-8 mt-6">
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-gray-700 text-xl ">Username or Email</label>
              <input
                type="text"
                placeholder="Enter your Username or Email"
                className="w-full px-4 py-2 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A52D5]  focus:shadow-md transition-transform duration-300"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
              />

              <label className="block text-gray-700 mt-4 text-xl ">Password</label>
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  className="w-full bg-white px-4 py-2 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A52D5]  focus:shadow-md transition-transform duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="ml-2 text-[#6C63FF] text-xl hover:text-[#5A52D5] transition duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? "/visible.svg" : "/hidden.svg"}
                    alt={showPassword ? "Hide" : "Show"}
                    className="w-7 h-7" 
                  />
                </button>
              </div>

              <div className="flex items-center mt-4">
                <input type="checkbox" id="terms" className="mr-2 " />
                <label htmlFor="terms" className="text-gray-600 mb-4 mt-2">
                  I agree to the{" "}
                  <span className="text-[#6C63FF] underline mb-4 mt-2">terms of service</span> and{" "}
                  <span className="text-[#6C63FF] underline mb-4 mt-2">privacy policy</span>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#669fd6] text-white text-xl py-2  font-bold rounded-lg mt-6 hover:bg-[#4b68ae] hover:scale-105 transition duration-300"
              >
                Login
              </button>

              {error && <p className="text-red-500 text-xl text-center mt-4">{error}</p>}
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600 text-xl">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/Registration")}
                  className="text-[#4b68ae] underline hover:text-[#2c2064] font-semibold hover:scale-100 text-2xl transition duration-300"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
