import { Search as SearchIcon, Send, Paperclip } from "lucide-react";
import React, { useState, useEffect } from "react";
import Search from "./Search";
import { ref, get } from "firebase/database";
import { realDb } from "../firebase";
import styles from "./Sidebar.module.css";

const Sidebar = ({ currentUser, recentChats, allUsers, onSelectChat }) => {
  const [chatsWithLastMessage, setChatsWithLastMessage] = useState({});

  useEffect(() => {
    const fetchLastMessages = async () => {
      const lastMessages = {};

      for (const chat of recentChats) {
        const chatRoomId = generateChatRoomId(currentUser.uid, chat.uid);
        const messagesRef = ref(realDb, `chats/${chatRoomId}/messages`);

        try {
          const snapshot = await get(messagesRef);
          if (snapshot.exists()) {
            // Convert messages to array and sort by timestamp
            const messages = [];
            snapshot.forEach((childSnapshot) => {
              messages.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
              });
            });

            // Sort messages by timestamp in descending order
            messages.sort((a, b) => b.timestamp - a.timestamp);

            // Store the last message
            if (messages.length > 0) {
              lastMessages[chat.uid] = messages[0];
            }
          }
        } catch (error) {
          console.error("Error fetching messages for chat:", chat.uid, error);
        }
      }

      setChatsWithLastMessage(lastMessages);
    };

    if (currentUser && recentChats.length > 0) {
      fetchLastMessages();
    }
  }, [recentChats, currentUser]);

  const generateChatRoomId = (uid1, uid2) => {
    const TEST_USER_ID = "user_1725465375818";
    return uid1 === TEST_USER_ID || uid2 === TEST_USER_ID
      ? `${TEST_USER_ID}_${uid1 === TEST_USER_ID ? uid2 : uid1}`
      : uid1 < uid2
      ? `${uid1}_${uid2}`
      : `${uid2}_${uid1}`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      // Today - show time
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      // Yesterday
      return "Yesterday";
    } else {
      // Other days - show date
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  // Sort recent chats by last message timestamp
  const sortedRecentChats = [...recentChats].sort((a, b) => {
    const lastMessageA = chatsWithLastMessage[a.uid];
    const lastMessageB = chatsWithLastMessage[b.uid];
    const timestampA = lastMessageA?.timestamp || a.lastMessageTime || 0;
    const timestampB = lastMessageB?.timestamp || b.lastMessageTime || 0;
    return timestampB - timestampA;
  });

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-4">
        <Search onSelectUser={onSelectChat} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {sortedRecentChats.map((chat) => {
          const lastMessage = chatsWithLastMessage[chat.uid];

          return (
            <div
              key={chat.uid}
              onClick={() => onSelectChat(chat)}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
            >
              <div className={styles.flip_card}>
                {chat.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <div className="font-medium truncate">{chat.username}</div>
                  {lastMessage && (
                    <div className="text-xs text-gray-500 ml-2">
                      {formatTimestamp(lastMessage.timestamp)}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {lastMessage ? (
                    <span>
                      {lastMessage.sender === currentUser.uid ? "You: " : ""}
                      {lastMessage.text}
                    </span>
                  ) : (
                    "No messages yet"
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
