import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { createUserInFirebase } from "../FirebaseOperations";
import { useNavigate } from "react-router-dom";
import { User } from "../models/User";

const Registration = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const formattedBirthdate = formatDate(birthdate);

        const newUser = new User(
          user.uid,
          username,
          password,
          formattedBirthdate,
          country,
          email
        );

        createUserInFirebase(newUser)
          .then((generatedUserId) => {
            setUserId(generatedUserId);
            localStorage.setItem("userId", generatedUserId);
            navigate("/Login");
          })
          .catch((error) => {
            setError("Error saving user data. Please try again.");
          });
      })
      .catch((error) => {
        setError("Error creating account. Please check your details and try again.");
      });
  };

  const handleLoginRedirect = () => {
    navigate("/Login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcf8f5] px-4 py-8">
      <div className="flex w-full max-w-7xl rounded-3xl shadow-xl drop-shadow-xl bg-white overflow-hidden">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
            Create Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xl text-gray-700 font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                className="w-full px-4 py-2 text-xl border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-xl font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@example.com"
                className="w-full px-4 py-2 text-xl border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-xl font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 text-xl border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-blue-500"
                >
                  <img
                    src={showPassword ? "/visible.svg" : "/hidden.svg"}
                    alt={showPassword ? "Hide" : "Show"}
                    className="w-7 h-7"
                  />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-xl font-medium mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="birthdate"
                placeholder="dd-mm-yyyy"
                className="w-full px-4 py-2 text-xl border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#669fd6] text-white text-xl font-bold py-2 rounded-lg mt-6 hover:bg-[#4b68ae] hover:scale-105 transition duration-300"
            >
              Register
            </button>
            {userId && <p className="text-center text-gray-600 mt-4">User ID: {userId}</p>}
        
            {error && (
              <p className="text-center text-red-500 text-lg mt-4">{error}</p>
            )}


            
          </form>
          <p className="text-center text-xl text-gray-700 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="text-xl font-semibold text-[#4b68ae] underline hover:text-[#2c2064]"
            >
              Login here
            </button>
          </p>
        </div>

        {/* Right Side - Illustration and Welcome Text */}
        
        <div className="w-1/2 bg-[#f0f4fa] flex flex-col justify-center items-center p-8">
          <h2 className="text-5xl font-bold text-gray-800">Welcome!!</h2>
          <p className="text-3xl font-bold text-[#c81f72] mt-2">
            Ready to conquer your day?
          </p>
          <img
            src="tt5.png" // Replace with your image path
            alt="Illustration"
            className="mt-6 w-4/4"
          />
        </div>
      </div>
    </div>
  );
};

export default Registration;
