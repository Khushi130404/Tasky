import React, { useState, useRef, useEffect } from "react";
import { createUserInFirebase } from "../FirebaseOperations";
import { useNavigate } from "react-router-dom";
import { User } from "../models/User";
import styles from "./Registration.module.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

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
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;

    const handleMouseMove = (e) => {
      const { width, height, left, top } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const rotateX = (y / height - 0.5) * 10; // Rotate based on vertical mouse movement
      const rotateY = (x / width - 0.5) * -10; // Rotate based on horizontal mouse movement

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    };

    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImageUrl(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Create new user object
    const formattedBirthdate = formatDate(birthdate);
    const newUser = new User(
      null, // userId will be generated in Firebase
      username,
      password,
      formattedBirthdate,
      country,
      email
    );

    if (profileImage) {
      const storageRef = ref(storage, `userProfiles/${Date.now()}_${username}`);
      uploadBytes(storageRef, profileImage).then(() => {
        getDownloadURL(storageRef).then((url) => {
          newUser.imageUrl = url;
          createUserInFirebase(newUser)
            .then((generatedUserId) => {
              setUserId(generatedUserId);
              localStorage.setItem("userId", generatedUserId);
              navigate("/MyActivity"); // Redirect to MyActivity page
            })
            .catch((error) => {
              setError("Error saving user data. Please try again.");
            });
        });
      });
    } else {
      createUserInFirebase(newUser)
        .then((generatedUserId) => {
          setUserId(generatedUserId);
          localStorage.setItem("userId", generatedUserId);
          navigate("/MyActivity"); // Redirect to MyActivity page
        })
        .catch((error) => {
          setError("Error saving user data. Please try again.");
        });
    }
  };

  const handleLoginRedirect = () => {
    navigate("/Login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcf8f5] px-20 py-7">
      <div ref={cardRef} className={styles.reg_container}>
        <div className="w-[90%] md:w-[50%] px-10 py-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create Account
          </h2>

          {/* Image Preview */}
          {profileImageUrl && (
            <div className="mb-4 flex justify-center">
              <img
                src={profileImageUrl}
                alt="Profile Preview"
                className={styles.reg_image}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 text-sm py-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-1 border text-sm border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
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
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>

            {/* Birthdate Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Birthdate
              </label>
              <input
                type="date"
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </div>

            {/* Country Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Country
              </label>
              <input
                type="text"
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Enter your country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Profile Image
              </label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="w-full text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#669fd6] text-white text-sm font-bold py-2 rounded-lg mt-6 hover:bg-[#4b68ae] hover:scale-105 transition duration-700"
            >
              Register
            </button>
            {userId && (
              <p className="text-center text-gray-600 mt-4">
                User ID: {userId}
              </p>
            )}

            {error && (
              <p className="text-center text-red-500 text-lg mt-4">{error}</p>
            )}
          </form>

          <p className="text-center text-md text-gray-700 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="text-blue-500 text-md underline hover:text-blue-700"
            >
              Login here
            </button>
          </p>
        </div>
        <div className="hidden md:flex md:w-1/2 order-1 md:order-1 bg-[#f0f5fc] rounded-3xl flex-col items-center justify-center p-8 text-center">
          <h1 className="text-5xl font-bold text-gray-800">Welcome!!</h1>
          <p className="text-red-500 font-medium text-3xl mt-2 mb-4">
            Ready to conquer your day?
          </p>
          <img src="tt5.png" alt="Illustration" className="w-4/4" />
        </div>
      </div>
    </div>
  );
};

export default Registration;
