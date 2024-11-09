import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { realDb } from "../firebase";
import { User } from "../models/User";
import TaskUpdate from "./TaskUpdate";
import styles from "./TaskItem.module.css";

const TaskItem = ({
  task,
  userId,
  upList,
  downList,
  deleteList,
  reloadWithTask,
}) => {
  const [isDone, setIsDone] = useState(task.is_done);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedTask, setUpdatedTask] = useState(task);

  const handleDeleteClick = async () => {
    const taskRef = ref(realDb, `users/${userId}/tasks/${task.taskId}`);
    set(taskRef, null);
    deleteList(task.priority - 1);
    try {
      const user = await User.fetch(userId);
      await user.updateStreak(task.date);
      console.log("Task deleted and streak updated successfully!");
    } catch (error) {
      console.error("Error updating streak:", error);
    }
    reloadWithTask();
  };

  const handleUpClick = () => {
    upList(task.priority - 1);
  };

  const handleDownClick = () => {
    downList(task.priority - 1);
  };

  const handleToggleDone = async () => {
    const newStatus = !isDone;
    const [day, month, year] = task.date.split("/");
    const taskDate = new Date(`${year}-${month}-${day}`);
    const currentDate = new Date();

    if (taskDate > currentDate) {
      console.log("Task cannot be marked as done before the due date.");
      return;
    }

    setIsDone(newStatus);

    try {
      const taskRef = ref(realDb, `users/${userId}/tasks/${task.taskId}`);
      await set(taskRef, {
        ...task,
        is_done: newStatus,
      });

      const user = await User.fetch(userId);
      await user.updateStreak(task.date);
      reloadWithTask();

      console.log("Task updated successfully and streak updated!");
    } catch (error) {
      console.error("Error updating task or streak:", error);
    }
  };

  const updateTask = async (taskId, newName, newLevel) => {
    const taskRef = ref(realDb, `users/${userId}/tasks/${taskId}`);
    const updatedTaskData = { ...task, taskname: newName, level: newLevel };
    try {
      await set(taskRef, updatedTaskData);
      setUpdatedTask(updatedTaskData);
      reloadWithTask();
      console.log("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`${styles.task_item} ${isDone ? styles.done : ""}`}>
      <h3>{task.taskname}</h3>
      <p>Level : {task.level}</p>
      <label>
        Done :{" "}
        <input type="checkbox" checked={isDone} onChange={handleToggleDone} />
      </label>
      <button className={styles.delete} onClick={handleDeleteClick}>
        Delete
      </button>
      <button className={styles.update} onClick={openModal}>
        Update
      </button>
      <button className={styles.down} onClick={handleDownClick}>
        <img src="down.svg"></img>
      </button>
      <button className={styles.up} onClick={handleUpClick}>
        <img src="up.svg"></img>
      </button>
      {isModalOpen && (
        <div className={styles.taskUpdateModal}>
          <div className={styles.modalContent}>
            <TaskUpdate
              isOpen={isModalOpen}
              onClose={closeModal}
              task={updatedTask}
              onUpdate={updateTask}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
