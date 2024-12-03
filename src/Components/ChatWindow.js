import React, { useState, useEffect, useRef } from "react";
import { ref, onValue, push, set } from "firebase/database";
import { realDb } from "../firebase";
import Message from "./Message";
import styles from "./ChatWindow.module.css";
import { Search as SearchIcon, Send, Paperclip } from "lucide-react";

const ChatWindow = ({ currentUser, chatPartner }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const TEST_USER_ID = "user_1725465375818";

  // Ref for the message container
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (currentUser && chatPartner && currentUser.uid && chatPartner.uid) {
      const chatRoomId = generateChatRoomId(currentUser.uid, chatPartner.uid);
      const messagesRef = ref(realDb, `chats/${chatRoomId}/messages`);

      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const chatMessages = [];
        snapshot.forEach((childSnapshot) => {
          chatMessages.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setMessages(chatMessages);
        console.log("Fetched messages:", chatMessages);
      });

      return () => unsubscribe();
    }
  }, [currentUser, chatPartner]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateChatRoomId = (uid1, uid2) => {
    return uid1 === TEST_USER_ID || uid2 === TEST_USER_ID
      ? `${TEST_USER_ID}_${uid1 === TEST_USER_ID ? uid2 : uid1}`
      : uid1 < uid2
      ? `${uid1}_${uid2}`
      : `${uid2}_${uid1}`;
  };

  const sendMessage = () => {
    console.log("Send button clicked");
    console.log("Current User:", currentUser);
    console.log("Chat Partner:", chatPartner);
    console.log("Message Text:", messageText);

    if (
      messageText.trim() === "" ||
      !currentUser ||
      !chatPartner ||
      !currentUser.uid ||
      !chatPartner.uid
    ) {
      console.log("Message not sent: invalid data");
      return;
    }

    const chatRoomId = generateChatRoomId(currentUser.uid, chatPartner.uid);
    const newMessage = {
      text: messageText,
      sender: currentUser.uid,
      timestamp: Date.now(),
    };

    const newMessageRef = push(ref(realDb, `chats/${chatRoomId}/messages`));
    set(newMessageRef, newMessage)
      .then(() => {
        console.log("Message sent successfully");
        updateRecentChat(currentUser.uid, chatPartner);
        updateRecentChat(chatPartner.uid, currentUser);
        setMessageText("");
        scrollToBottom(); // Scroll to bottom after sending a message
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const updateRecentChat = (userId, partner) => {
    if (!userId || !partner || !partner.uid || !partner.username) return;

    const recentChatRef = ref(
      realDb,
      `users/${userId}/recentChats/${partner.uid}`
    );
    set(recentChatRef, {
      uid: partner.uid,
      username: partner.username,
      lastMessageTime: Date.now(),
    });
  };

  if (!chatPartner || !chatPartner.username) {
    return <div>Please select a chat partner</div>;
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className={styles.chat_head_outer}>
        <div
          className={`p-4 flex items-center gap-2 ${styles.chat_head_inner}`}
        >
          <div className={styles.flip_card}>
            {chatPartner.username?.[0]?.toUpperCase()}
          </div>
          <div className="text-xl font-semibold ml-2 text-white">
            {chatPartner.username}
          </div>
        </div>
      </div>

      <div
        ref={messageContainerRef} // Attach ref to the message container
        className={`flex-1 overflow-y-auto`}
      >
        <div className={`space-y-4 p-5`}>
          {messages.map((msg) => (
            <Message
              key={msg.id}
              message={msg}
              isSentByCurrentUser={msg.sender === currentUser.uid}
            />
          ))}
        </div>
      </div>

      <div>
        <div className={`p-1 pb-2`}>
          <div className="flex items-center p-4 gap-3">
            <button className="text-gray-400 hover:text-gray-600">
              <Paperclip className="h-5 w-5 text-[#8d88b3] hover:text-[#625b97]" />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1 placeholder-[#8d88b3] text-[#3B1E54] font-semibold border border-[#9B7EBD] rounded-lg px-4 py-2 focus:outline-none focus:border-[#3B1E54]"
            />
            <button onClick={sendMessage} className={styles.chat_button}>
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
