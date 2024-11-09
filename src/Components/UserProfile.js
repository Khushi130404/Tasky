import { useEffect, useState } from "react";
import { User } from "../models/User";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <br></br>
      <br></br>
      <div className={styles.profile_container}>
        <h2 className={styles.profile_header}>User Profile</h2>
        <form className={styles.profile_form} onSubmit={handleSubmit}>
          {imageUrlPreview && (
            <div className={styles.profile_imageContainer}>
              <img
                src={imageUrlPreview}
                alt="Profile"
                className={styles.profile_image}
              />
            </div>
          )}
          <div>
            <label className={styles.profile_label}>Username :</label>
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
            <label className={styles.profile_label}>Email :</label>
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
          <div className={styles.profile_passwordContainer}>
            <label className={styles.profile_label}>Password :</label>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              className={styles.profile_passwordInput}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              className={styles.profile_toggleButton}
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
          <div>
            <label className={styles.profile_label}>Birthdate :</label>
            <input
              type="date"
              name="birthdate"
              className={styles.profile_dateInput}
              value={formData.birthdate}
              onChange={(e) =>
                setFormData({ ...formData, birthdate: e.target.value })
              }
            />
          </div>
          <div>
            <label className={styles.profile_label}>Country :</label>
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
            <label className={styles.profile_label}>Profile Image :</label>
            <input
              type="file"
              className={styles.profile_input}
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className={styles.profile_submitButton}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
