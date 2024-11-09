import { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import StreakCalendar from "./StreakCalendar";
import Navbar from "./Navbar";
import styles from "./MyActivity.module.css";
import Footer from "./Footer";
import { User } from "../models/User"; // Adjust import path as needed

const MyActivity = () => {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // State to hold the image URL

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      const fetchedUser = await User.fetch(userId);
      setUser(fetchedUser);

      if (fetchedUser.imageUrl) {
        // Fetch the download URL for the image
        const storage = getStorage();
        const storageRef = ref(storage, fetchedUser.imageUrl);
        try {
          const url = await getDownloadURL(storageRef);
          setImageUrl(url); // Set the image URL state
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.navbar}>
          <Navbar />
        </div>
        <div className={styles.streak}>
          <h1 className={styles.heading}>My Activity</h1>
          <br></br>
          <br></br>
          {user && (
            <div className={styles.userGreeting}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className={styles.profileImage}
                />
              )}
              <h2 className={styles.userTask}>{user.username}'s Task</h2>
            </div>
          )}
          <StreakCalendar />
        </div>
      </div>
      <Footer className={styles.footer} />
    </div>
  );
};

export default MyActivity;
