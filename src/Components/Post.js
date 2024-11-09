// Post.js
import React, { useState } from "react";
import { realDb } from "../firebase";
import { ref, update, push, serverTimestamp } from "firebase/database";
import styles from "./Post.module.css";

const Post = ({ post, user }) => {
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    const postRef = ref(realDb, `posts/${post.id}`);
    const updates = {};

    if (post.likes && post.likes[user.uid]) {
      updates[`likes/${user.uid}`] = null;
    } else {
      updates[`likes/${user.uid}`] = true;
    }

    await update(postRef, updates);
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    const commentsRef = ref(realDb, `posts/${post.id}/comments`);
    await push(commentsRef, {
      content: newComment,
      userId: user.uid,
      username: user.displayName,
      createdAt: serverTimestamp(),
    });

    setNewComment("");
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const likesCount = post.likes ? Object.keys(post.likes).length : 0;
  const comments = post.comments ? Object.values(post.comments) : [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={styles.flip_card}>
            {post.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{post.username}</h3>
            <p className="text-sm text-gray-500">
              {formatTimestamp(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 text-lg">{post.content}</p>

      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            post.likes && post.likes[user.uid]
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-600"
          } hover:bg-blue-100 hover:text-blue-600 transition duration-200`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition duration-200"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          {comments.map((comment, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={styles.flip_card_comment}>
                    {comment.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800">
                    {comment.username}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 ml-10">{comment.content}</p>
            </div>
          ))}

          <div className="flex space-x-2 mt-4">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleComment}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200"
            >
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
