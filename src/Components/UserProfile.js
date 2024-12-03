import { useEffect, useState, useRef } from "react";
import { User } from "../models/User";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirecting
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    birthdate: "",
    country: "",
    email: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlPreview, setImageUrlPreview] = useState("");
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    glow.addEventListener("mousemove", handleMouseMove);

    return () => {
      glow.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const fetchedUser = await User.fetch(userId);
        setUser(fetchedUser);

        if (fetchedUser.imageUrl) {
          // Fetch the download URL to get the latest version
          const storage = getStorage();
          const storageRef = ref(storage, fetchedUser.imageUrl);
          const imageUrl = await getDownloadURL(storageRef);
          setImageUrlPreview(`${imageUrl}?t=${new Date().getTime()}`); // Append timestamp to force reload
        }

        const [day, month, year] = fetchedUser.birthdate.split("-");
        const formattedDate = `${year}-${month}-${day}`;
        setFormData({
          username: fetchedUser.username,
          password: fetchedUser.password,
          birthdate: formattedDate,
          country: fetchedUser.country,
          email: fetchedUser.email,
          imageUrl: fetchedUser.imageUrl,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setImageUrlPreview(URL.createObjectURL(e.target.files[0])); // Update preview immediately
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update the image if a new file was chosen
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `userProfiles/${userId}`);
        await uploadBytes(storageRef, imageFile);
        const newImageUrl = await getDownloadURL(storageRef);
        formData.imageUrl = `userProfiles/${userId}`; // Update `formData` with the image path
        setImageUrlPreview(`${newImageUrl}?t=${new Date().getTime()}`);
        user.imageUrl = formData.imageUrl; // Update user instance as well
      }

      const [year, month, day] = formData.birthdate.split("-");
      const formattedBirthdate = `${day}-${month}-${year}`;

      user.username = formData.username;
      user.password = formData.password;
      user.birthdate = formattedBirthdate;
      user.country = formData.country;
      user.email = formData.email;
      await user.save();
      alert("Profile updated successfully!");
      setUser({ ...user });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    // Ask for confirmation before logging out
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // Remove user data from localStorage and redirect to login page
      localStorage.removeItem("userId");
      navigate("/login"); // Redirect to login page
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={glowRef} className={`${styles.profile_outer}`}>
      <div
        className={`flex min-h-screen items-center justify-center bg-[#f5f5f5f] py-0 px-20 ${styles.profile_inner}`}
      >
        <div
          className="glowingEffect"
          style={{
            position: "absolute",
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            width: "1px",
            height: "1px",
            backgroundColor: "#6a3ba3",
            borderRadius: "50%",
            boxShadow: "0 0 200px 200px #481e7cf5",
            pointerEvents: "none",
            transform: "scale(1)",
            transition: "all 0s ease-in-out",
            opacity: 0.3,
            animation: "pulse 0s infinite",
          }}
        ></div>

        <div ref={cardRef} className={styles.profile_container}>
          <div className={`${styles.blurBackground} w-[100%] md:w-[100%]`}>
            <div className={styles.blur_inner}>
              <h2 className="text-3xl font-bold text-center text-[#f5f5f5] mb-3">
                User Profile
              </h2>
              {imageUrlPreview && (
                <div className="mb-0 flex justify-center">
                  <img
                    src={imageUrlPreview}
                    alt="Profile"
                    className={styles.profile_image}
                  />
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm text-[#d1c4db] font-medium mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    className={styles.profile_input}
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[#d1c4db] text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={styles.profile_input}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <p className={styles.profile_error}>{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[#d1c4db] text-sm font-medium mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      className={styles.profile_input}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        setPasswordVisible((prevState) => !prevState)
                      }
                    >
                      <img
                        src={
                          passwordVisible
                            ? "/visible.svg"
                            : "/hidden.svg"
                        }
                        alt="Toggle visibility"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[#d1c4db] text-sm font-medium mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    className={styles.profile_input}
                    value={formData.birthdate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthdate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[#d1c4db] text-sm font-medium mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    className={styles.profile_input}
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[#d1c4db] text-sm font-medium mb-1">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className={styles.profile_input}
                  />
                </div>

                <button
                  type="submit"
                  className="text-white text-lg font-medium bg-[#6a3ba3] hover:bg-[#481e7c] w-full py-2 rounded-md"
                >
                  Update Profile
                </button>
              </form>

              <button
                onClick={handleLogout}
                className="text-white text-lg font-medium bg-[#e53946] hover:bg-[#d32f2f] w-full py-2 mt-4 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
