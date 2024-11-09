import { realDb, auth } from "./firebase";

import {
  ref,
  set,
  push,
  get,
  child,
  query,
  orderByChild,
  startAt,
  endAt,
} from "firebase/database";

export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid; // Get the UID of the current user
    const userRef = ref(realDb, `users/${userId}`);

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return { id: userId, ...snapshot.val() }; // Return user ID and data
      } else {
        console.log("No user data available");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  } else {
    console.log("No user is signed in");
    return null;
  }
};

export const createUserInFirebase = (user) => {
  const userId = `user_${Date.now()}`;
  const userRef = ref(realDb, `users/${userId}`);

  return set(userRef, {
    username: user.username,
    password: user.password,
    birthdate: user.birthdate,
    country: user.country,
    email: user.email,
    imageUrl: user.imageUrl,
  })
    .then(() => {
      console.log("User data saved successfully for userId:", userId);
      return userId;
    })
    .catch((error) => {
      console.error("Error creating user in Firebase:", error);
      throw error; // Rethrow error to catch it in the main flow
    });
};

export const createEmptyUserChatsCollection = (userId) => {
  const userChatsRef = ref(realDb, `chats/${userId}`);
  return set(userChatsRef, {})
    .then(() => {
      console.log("Empty chats collection initialized for userId:", userId);
    })
    .catch((error) => {
      console.error("Error creating empty chats collection:", error);
      throw error; // Rethrow error to catch it in the main flow
    });
};
export const fetchRecentChats = async (userId) => {
  const snapshot = await realDb
    .ref(`/users/${userId}/recentChats`)
    .once("value");
  const recentChats = [];
  snapshot.forEach((childSnapshot) => {
    recentChats.push(childSnapshot.val());
  });
  return recentChats;
};

// Search for users in the database
export const searchUsers = async (query) => {
  const snapshot = await realDb
    .ref("/users")
    .orderByChild("username")
    .startAt(query)
    .endAt(query + "\uf8ff")
    .once("value");
  const users = [];
  snapshot.forEach((childSnapshot) => {
    users.push(childSnapshot.val());
  });
  return users;
};

// Send a message between two users
export const sendMessage = (senderId, recipientId, message) => {
  const newMessage = {
    senderId,
    recipientId,
    text: message,
    timestamp: Date.now(),
  };
  realDb.ref(`/chats/${senderId}_${recipientId}`).push(newMessage);
  realDb.ref(`/chats/${recipientId}_${senderId}`).push(newMessage);
};

// Fetch messages between two users
export const fetchMessages = async (userId, selectedUserId) => {
  const snapshot = await realDb
    .ref(`/chats/${userId}_${selectedUserId}`)
    .orderByChild("timestamp")
    .limitToLast(50)
    .once("value");
  const messages = [];
  snapshot.forEach((childSnapshot) => {
    messages.push(childSnapshot.val());
  });
  return messages;
};

export const getLoggedInUser = () => {
  const user = auth.currentUser;
  if (user) {
    // User is signed in
    return {
      uid: user.uid,
      email: user.email,
      username: user.displayName, // Assuming you are setting the displayName during registration
    };
  } else {
    // No user is signed in, you may redirect or handle the situation
    return null;
  }
};
