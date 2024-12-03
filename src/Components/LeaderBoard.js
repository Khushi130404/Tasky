import React, { useState, useEffect, useRef } from "react";
import { ref, get } from "firebase/database";
import { realDb } from "../firebase";
import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from "./LeaderBoard.module.css";
import { User } from "../models/User";
import { getLoggedInUser } from "../FirebaseOperations";
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
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [loggedInUserRank, setLoggedInUserRank] = useState(null);
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
   const canvasRef = useRef(null);
   const ballsRef = useRef([]);
   const streakRef = useRef(null);
  const navbarRef = useRef(null);
  const footerRef = useRef(null);
  const mouse = useRef({ x: undefined, y: undefined });
  // const rgb = [
  //   // Darker Pink shades
  //   "rgb(105, 0, 30)", // Darker Pink
  //   "rgb(184, 0, 76)", // Darker Deep Pink
  //   "rgb(139, 0, 44)", // Dark Raspberry
  //   "rgb(255, 20, 147)", // Deep Pink

  //   // Darker Purple shades
  //   "rgb(75, 0, 130)", // Darker Purple
  //   "rgb(55, 0, 100)", // Darker Indigo (a dark purple-blue)
  //   "rgb(48, 25, 52)", // Dark Eggplant
  //   "rgb(93, 33, 57)", // Dark Violet

  //   // Darker Blue shades
  //   "rgb(0, 0, 85)", // Darker Blue
  //   "rgb(0, 0, 139)", // Dark Blue
  //   "rgb(0, 0, 128)", // Navy Blue
  //   "rgb(0, 51, 102)", // Dark Steel Blue
  //   "rgb(0, 102, 204)", // Deep Sky Blue

  //   // Darker Cyan shades
  //   "rgb(0, 77, 77)", // Darker Cyan
  //   "rgb(0, 139, 139)", // Dark Cyan
  //   "rgb(0, 128, 128)", // Teal
  //   "rgb(0, 102, 102)", // Dark Sea Green

  //   // Adding more Darker shades of Pink, Purple, Blue, Cyan
  //   "rgb(94, 0, 32)", // Very Dark Pink
  //   "rgb(69, 0, 42)", // Dark Crimson
  //   "rgb(128, 0, 128)", // Purple (same as dark purple but more neutral)
  //   "rgb(38, 0, 77)", // Dark Magenta
  //   "rgb(0, 0, 205)", // Medium Dark Blue
  //   "rgb(0, 36, 68)", // Dark Slate Blue
  //   "rgb(0, 48, 58)", // Deep Dark Cyan
  //   "rgb(0, 83, 83)", // Dark Sea Green
  // ];

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const str = streakRef.current;
  //   const ctx = canvas.getContext("2d");
  //   const navbar = navbarRef.current;
  //   const footer = footerRef.current;
  //   let w, h;

  //   function resizeReset() {
  //     w = canvas.width = window.innerWidth;
  //     h = canvas.height = window.innerHeight;
  //   }

  //   function init() {
  //     resizeReset();
  //     animationLoop();
  //   }

  //   function animationLoop() {
  //     ctx.clearRect(0, 0, w, h);
  //     ctx.globalCompositeOperation = "destination-over";
  //     if (!isMouseOverElement(navbar) && !isMouseOverElement(footer)) {
  //       drawBalls(ctx);
  //     }

  //     ballsRef.current = ballsRef.current.filter(
  //       (ball) => ball.time <= ball.ttl
  //     );

  //     requestAnimationFrame(animationLoop);
  //   }

  //   function drawBalls(ctx) {
  //     ballsRef.current.forEach((ball) => {
  //       ball.update();
  //       ball.draw(ctx);
  //     });
  //   }
  //   function mousemove(e) {
  //     const rect = canvas.getBoundingClientRect();
  //     mouse.current.x = e.clientX;
  //     mouse.current.y = e.clientY;
  //     if (!isMouseOverElement(navbar) && !isMouseOverElement(footer)) {
  //       Array.from({ length: 3 }).forEach(() =>
  //         ballsRef.current.push(new Ball(mouse.current))
  //       );
  //     }
  //   }

  //   function mouseout() {
  //     mouse.current.x = undefined;
  //     mouse.current.y = undefined;
  //   }

  //   function isMouseOverElement(element) {
  //     if (!element) return false;
  //     const rect = element.getBoundingClientRect();
  //     return (
  //       mouse.current.x >= rect.left - 25 &&
  //       mouse.current.x <= rect.right + 25 &&
  //       mouse.current.y >= rect.top - 25 &&
  //       mouse.current.y <= rect.bottom + 25
  //     );
  //   }

  //   function getRandomInt(min, max) {
  //     return Math.round(Math.random() * (max - min)) + min;
  //   }

  //   function easeOutQuart(x) {
  //     return 1 - Math.pow(1 - x, 4);
  //   }

  //   animationLoop();
  //   // Add event listeners
  //   window.addEventListener("mousemove", mousemove);
  //   window.addEventListener("mouseout", mouseout);
  //   window.addEventListener("resize", resizeReset);

  //   // Initialize animation
  //   init();

  //   // Clean up event listeners on unmount
  //   return () => {
  //     window.removeEventListener("mousemove", mousemove);
  //     window.removeEventListener("mouseout", mouseout);
  //     window.removeEventListener("resize", resizeReset);
  //   };
  // }, []);

  // class Ball {
  //   constructor(mouse) {
  //     this.start = {
  //       x: mouse.x + Math.random() * 5 - 2.5,
  //       y: mouse.y + Math.random() * 5 - 2.5,
  //       size: Math.random() * 10 + 10,
  //     };
  //     this.end = {
  //       x: this.start.x + Math.random() * 600 - 300,
  //       y: this.start.y + Math.random() * 600 - 300,
  //     };
  //     this.x = this.start.x;
  //     this.y = this.start.y;
  //     this.size = this.start.size;
  //     this.style = rgb[Math.floor(Math.random() * rgb.length)];
  //     this.time = 0;
  //     this.ttl = 600;
  //   }
  //   draw(ctx) {
  //     ctx.fillStyle = this.style;
  //     ctx.beginPath();
  //     ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  //     ctx.closePath();
  //     ctx.fill();
  //   }
  //   update() {
  //     const progress = 1 - (this.ttl - this.time) / this.ttl;
  //     this.size = this.start.size * (1 - (1 - progress) ** 4);
  //     this.x = this.start.x;
  //     this.y = this.start.y;
  //     this.time++;
  //   }
  // }

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      const fetchedUser = await User.fetch(userId);
      setUser(fetchedUser);

      if (fetchedUser.imageUrl) {
        // Fetch the download URL for the image
        const storage = getStorage();
        const storRef = storageRef(storage, fetchedUser.imageUrl);
        try {
          const url = await getDownloadURL(storRef);
          setImageUrl(url); // Set the image URL state
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

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
        return <span className="text-gray-300">🏆 Gold Medal</span>;
      case 1:
        return <span className="text-gray-300">🥈 Silver Medal</span>;
      case 2:
        return <span className="text-gray-300">🥉 Bronze Medal</span>;
      default:
        return <span className="text-gray-300">🎖 participant</span>;
    }
  };

  return (
    <div className={`leaderboard-container ${styles.fullScreenDiv}`}>
      <div>
        <div ref={navbarRef} className={styles.navbar}>
          <Navbar></Navbar>
        </div>
        

        <div
          className={`container mx-auto ${styles.leader_outer}`}
          style={{ paddingLeft: "250px" }}
        >
          <canvas ref={canvasRef} className={styles.canvas} id="canvas" />
          <div className={`px-20 py-8 w-[100%] ${styles.leader_inner}`}>
            <h1 className={styles.heading}>LeaderBoard</h1>
            <h1 className={styles.heading}>LeaderBoard</h1>
            {user && (
              <div className={styles.userGreeting}>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Profile"
                    className={styles.profileImage}
                  />
                )}
                <h2 className={styles.userTask}>{user.username} Here !</h2>
              </div>
            )}
            {/* Logged-in User's Rank */}
            {loggedInUserRank ? (
              <div
                className={`bg-white shadow-lg rounded-lg mb-10 ${styles.rank_outer}`}
              >
                <div className={`p-4 ${styles.rank_inner}`}>
                  <h2 className="text-xl font-bold text-white mb-1">
                    Your Rank : {loggedInUserRank.rank}
                  </h2>
                  <p className="text-gray-400 text-lg font-semibold">
                    Username : {loggedInUserRank.username}
                  </p>
                  <p className="text-gray-400 text-lg font-semibold">
                    Tasks Completed : {loggedInUserRank.completedTasks}
                  </p>
                  <p className="text-gray-400 text-lg font-semibold">
                    Score : {loggedInUserRank.score}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-lg p-4 mb-12">
                <h2 className="text-xl font-bold mb-2">Your Rank : N/A</h2>
                <p className="text-gray-600 text-sm">
                  Could not find your data in the leaderboard.
                </p>
              </div>
            )}
            {/* Top 3 Contributors */}
            <div className={styles.outerRankBoard}>
              <h3>Streak Stars : The Top 3 Taskmasters</h3>
              <div className={styles.centerImage}>
                <img src="/leader.svg"></img>
                <p>
                  Gold, Silver, Bronze: more than medals, they're your hustle
                  goals!
                </p>
                <p>Push harder, aim higher, and own the leaderboard!</p>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-8`}>
                {users.slice(0, 3).map((user, index) => (
                  <div
                    key={user.userId}
                    className={`shadow-xl text-sm rounded-2xl flex flex-col mr-4 items-center hover:cursor-pointer  ${
                      index === 0
                        ? "border-t-4 border-[#9793ba]"
                        : index === 1
                        ? "border-t-4 border-[#9793ba]"
                        : "border-t-4 border-[#9793ba]"
                    } ${styles.rank_board_outer}`}
                  >
                    <div className={`${styles.rank_board_inner} p-5`}>
                      <h2 className="text-lg text-white font-bold mb-1">
                        {user.username}
                      </h2>
                      <p className="text-gray-400 font-semibold">
                        Tasks Completed: {user.completedTasks}
                      </p>
                      <p className="text-gray-400 font-semibold">
                        Score: {user.score}
                      </p>
                      <div className="mt-3 font-semibold">
                        {getReward(index)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Leaderboard Table for the rest */}
            <div className={styles.leader_board_outer}>
              <div className={`overflow-y-auto ${styles.leader_board_inner}`}>
                <table className="min-w-full relative border-gray-400 shadow-md rounded-lg overflow-hidden hover:cursor-pointer">
                  <thead
                    className={`text-md sticky top-0 z-10 font-bold ${styles.table_head}`}
                  >
                    <tr>
                      <th className="px-5 py-3.5 text-left">Rank</th>
                      <th className="px-5 text-left">Username</th>
                      {/* <th className="px-4 text-left">User ID</th> */}
                      <th className="px-5 text-left">Completed</th>
                      <th className="px-5 text-left">Score</th>
                      <th className="px-5 text-left">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr
                        key={user.userId}
                        className={`hover:bg-g hover:cursor-pointer text-sm duration-300 ${
                          user.userId === loggedInUserRank?.userId
                            ? "bg-transparent"
                            : "bg-transparent"
                        } ${styles.leader_table_li}`} // Highlight logged-in user's row
                      >
                        <td className="px-8 py-3 text-gray-300">{index + 1}</td>
                        <td className="py-2 px-6 text-gray-300 hover:scale-105">
                          {user.username}
                        </td>
                        {/* <td className="p-2 text-gray-300">{user.userId}</td> */}
                        <td className="px-16 text-gray-300">
                          {user.completedTasks}
                        </td>
                        <td className="px-9 text-gray-300">{user.score}</td>
                        <td className="py-2 px-4 text-gray-300">
                          {getReward(index)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Display the performance graph */}
            <div className={styles.graphOuter}>
              <h2 className="text-2xl text-center text-white font-bold">
                Weekly Showdown : The Top 10 Task Titans
              </h2>
              <div className={styles.centerImageGraph}>
                <img src="/graph.svg"></img>
                <p>
                  Check out the top 10 users' vibes! Charts show their scores &
                  tasks smashed.
                </p>
                <p>Insights = user energy + productivity decoded!</p>
              </div>
              <ResponsiveContainer
                width="100%"
                height={400}
                className="mt-4 mb-3 pr-5 transition-opacity duration-500 opacity-100 hover:opacity-80 text-black"
              >
                <LineChart
                  data={users.slice(0, 10)}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="username" className="text-black text-sm" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8B5DFF"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="completedTasks"
                    stroke="#9793ba"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default LeaderBoard;
