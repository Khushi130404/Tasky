import React from "react";
import { User } from "../models/User";
import { Task } from "../models/Task";

const MyComponent = () => {
  const handleClick = async () => {
    try {
      const userId = `user_${Date.now()}`;
      const user = new User(
        userId,
        "JohnDoe",
        "securepassword123",
        "1990-01-01",
        "USA"
      );

      await user.save();
      console.log("User created successfully!");

      const task = new Task(
        `task_${Date.now()}`,
        new Date().toISOString(),
        "Sample Task",
        "High",
        false
      );

      await task.save(userId);
      console.log("Task added successfully!");

      task.is_done = true;
      await task.update(userId);
      console.log("Task updated successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Hello, world!</h1>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
};

export default MyComponent;
