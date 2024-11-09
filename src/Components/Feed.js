import React, { useState, useEffect } from "react";
import { realDb } from "../firebase";
import { ref, onValue, query, orderByChild, get } from "firebase/database";
import AddPost from "./AddPost";
import PostList from "./PostList";
import styles from "./Feed.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const motivationalQuotes = [
  "Every moment is a fresh beginning.",
  "The best time to start was yesterday. The next best time is now.",
  "Your potential is limitless.",
  "Small steps lead to big changes.",
];

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [quote, setQuote] = useState("");
  const [topStreaks, setTopStreaks] = useState([]);
  const userId = localStorage.getItem("userId");

  const fetchUsername = async (userId) => {
    try {
      const userRef = ref(realDb, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        return userData.username;
      }
      return null;
    } catch (error) {
      console.error("Error fetching username:", error);
      return null;
    }
  };

  const fetchTopStreaks = async () => {
    const streaksRef = ref(realDb, "users");
    const snapshot = await get(streaksRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      const streakData = Object.entries(users)
        .map(([id, user]) => ({
          username: user.username,
          streak: user.streak?.[0] || "0",
        }))
        .sort((a, b) => parseInt(b.streak) - parseInt(a.streak))
        .slice(0, 5);
      setTopStreaks(streakData);
    }
  };

  useEffect(() => {
    const randomQuote =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);

    if (userId) {
      fetchUsername(userId).then((fetchedUsername) => {
        if (fetchedUsername) {
          setUsername(fetchedUsername);
        }
      });
    }

    fetchTopStreaks();

    const postsRef = ref(realDb, "posts");
    const postsQuery = query(postsRef, orderByChild("createdAt"));

    const unsubscribe = onValue(postsQuery, (snapshot) => {
      const postsData = snapshot.val();
      const postsArray = postsData
        ? Object.entries(postsData)
            .map(([id, post]) => ({
              id,
              ...post,
            }))
            .sort(
              (a, b) =>
                Object.keys(b.likes || {}).length -
                Object.keys(a.likes || {}).length
            )
        : [];
      setPosts(postsArray);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div>
      <Navbar></Navbar>
      <div className="min-h-screen bg-gray-50" style={{ marginLeft: "250px" }}>
        {/* Quote Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-xl italic font-light text-center">{quote}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {userId && username ? (
            <div className="flex gap-8">
              {/* Left Column - Posts */}
              <div className="flex-grow max-w-3xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800"></h2>
                <PostList
                  posts={posts}
                  user={{ uid: userId, displayName: username }}
                />
              </div>

              {/* Right Column - Add Post & Streaks */}
              <div className="w-80 space-y-6">
                {/* Add Post Section */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Share Thoughts
                  </h3>
                  <AddPost />
                </div>

                {/* Top Streaks Section */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Top Streaks 🔥
                  </h3>
                  <div className="space-y-3">
                    {topStreaks.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={styles.flip_card}>
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-700">
                            {user.username}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-orange-500 font-semibold">
                            {user.streak}
                          </span>
                          <span className="text-orange-500">🔥</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your feed...</p>
            </div>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Feed;
