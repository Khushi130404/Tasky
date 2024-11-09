import React, { useState } from "react";
import { realDb } from "../firebase";
import styles from "./AddPost.module.css"
import { ref, push, serverTimestamp, get } from "firebase/database";

const AddPost = () => {
  const [newPost, setNewPost] = useState("");
  const userId = localStorage.getItem("userId");

  const fetchUsername = async (userId) => {
    const userRef = ref(realDb, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val().username;
    } else {
      console.log("No user found with this userId.");
      return null;
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const username = await fetchUsername(userId);

    if (username) {
      const postsRef = ref(realDb, "posts");
      await push(postsRef, {
        content: newPost,
        userId: userId,
        username: username,
        createdAt: serverTimestamp(),
        likes: {},
        comments: {},
      });

      setNewPost("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create Post</h2>
      <form onSubmit={handlePostSubmit} className="space-y-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 transition duration-200 text-gray-700 placeholder-gray-400"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 font-medium shadow-sm"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddPost;