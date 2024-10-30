import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { realDb } from "../firebase";
import { getLoggedInUser } from "../FirebaseOperations"; // Import the function
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [loggedInUserRank, setLoggedInUserRank] = useState(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      const usersRef = ref(realDb, "users/");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();

        const leaderboardData = Object.keys(usersData).map((userId) => {
          const user = usersData[userId];
          const completedTasks = Object.values(user.tasks || {}).filter(
            (task) => task.is_done === true
          ).length;

          const score = Object.values(user.tasks || {}).reduce(
            (total, task) => (task.is_done ? total + task.priority : total),
            0
          );

          return {
            userId, // User ID from Firebase
            username: user.username,
            completedTasks,
            score,
          };
        });

        // Sort leaderboard by score, then by completed tasks
        leaderboardData.sort(
          (a, b) => b.score - a.score || b.completedTasks - a.completedTasks
        );

        // Get the logged-in user information
        const loggedInUser = localStorage.getItem("userId");

        if (loggedInUser) {
          const userRank = leaderboardData.find(
            (user) => user.userId === loggedInUser
          );
          if (userRank) {
            setLoggedInUserRank({
              ...userRank,
              rank: leaderboardData.indexOf(userRank) + 1,
            });
          }
        }

        console.log("Leaderboard Data:", leaderboardData);
        setUsers(leaderboardData);
      }
    };

    fetchUsersData();
  }, []);

  const getReward = (index) => {
    switch (index) {
      case 0:
        return <span className="text-amber-500">🏆 Gold Medal</span>;
      case 1:
        return <span className="text-slate-800">🥈 Silver Medal</span>;
      case 2:
        return <span className="text-orange-800">🥉 Bronze Medal</span>;
      default:
        return <span className="text-gray-500">🎖 Participation Badge</span>;
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-5xl font-bold text-center mb-14 mt-14">
        LeaderBoard
      </h1>

      {/* Logged-in User's Rank */}
      {loggedInUserRank ? (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
          <h2 className="text-3xl font-bold mb-2">
            Your Rank: {loggedInUserRank.rank}
          </h2>
          <p className="text-gray-600  text-xl font-semibold mb-1">
            Username: {loggedInUserRank.username}
          </p>
          <p className="text-gray-600 text-xl font-semibold mb-1">
            Tasks Completed: {loggedInUserRank.completedTasks}
          </p>
          <p className="text-gray-600 text-xl font-semibold mb-1">
            Score: {loggedInUserRank.score}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
          <h2 className="text-3xl font-bold mb-2">Your Rank: N/A</h2>
          <p className="text-gray-600">
            Could not find your data in the leaderboard.
          </p>
        </div>
      )}

      {/* Top 3 Contributors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-9">
        {users.slice(0, 3).map((user, index) => (
          <div
            key={user.userId}
            className={`bg-white shadow-xl text-xl rounded-2xl p-4 flex flex-col mr-4 items-center hover:cursor-pointer 
              transition-transform duration-300 hover:scale-105  ${
                index === 0
                  ? "border-t-4 border-yellow-400"
                  : index === 1
                  ? "border-t-4 border-gray-400"
                  : "border-t-4 border-orange-400"
              }`}
          >
            <h2 className="text-2xl font-bold mb-1">{user.username}</h2>
            <p className="text-gray-600 font-semibold">
              Tasks Completed: {user.completedTasks}
            </p>
            <p className="text-gray-600 font-semibold">Score: {user.score}</p>
            <div className="mt-3 font-semibold">{getReward(index)}</div>
          </div>
        ))}
      </div>

      {/* Leaderboard Table for the rest */}
      <div className="overflow-y-auto max-h-96">
        {" "}
        {/* Scrollable div */}
        <table className="min-w-full bg-white border-2 border-gray-400 shadow-md rounded-lg overflow-hidden hover:cursor-pointer">
          <thead className="bg-blue-200 text-xl font-bold">
            <tr>
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Completed Tasks</th>
              <th className="p-3 text-left">Score</th>
              <th className="p-3 text-left">Reward</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.userId}
                className={`hover:bg-gray-200 hover:cursor-pointer text-xl transition-colors duration-300 ${
                  user.userId === loggedInUserRank?.userId
                    ? "bg-yellow-100"
                    : ""
                }`} // Highlight logged-in user's row
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3 hover:scale-105">{user.username}</td>
                <td className="p-3">{user.userId}</td>
                <td className="p-3">{user.completedTasks}</td>
                <td className="p-3">{user.score}</td>
                <td className="p-3">{getReward(index)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display the performance graph */}
      <h2 className="text-3xl  text-center mt-10 font-bold">
        Weekly Performance Comparison (Top 7 Users)
      </h2>
      <ResponsiveContainer
        width="100%"
        height={400}
        className="mt-4 transition-opacity duration-500 opacity-100 hover:opacity-80 text-black"
      >
        <LineChart
          data={users.slice(0, 5)} // Show only the top 7 users
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="username" className="text-black" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#8884d8" />
          <Line type="monotone" dataKey="completedTasks" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaderBoard;
