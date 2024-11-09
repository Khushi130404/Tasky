import React, { useState, useEffect, useRef } from "react";
import TaskList from "./TaskList";
import { User } from "../models/User";
import TaskForm from "./TaskForm";
import styles from "./StreakCalendar.module.css";

const StreakCalendar = () => {
  const [calendarDays, setCalendarDays] = useState([]);
  const [activityDays, setActivityDays] = useState([]);
  const userId = localStorage.getItem("userId");
  const tableRef = useRef(null);

  useEffect(() => {
    const table = tableRef.current;

    const handleMouseMove = (e) => {
      const { width, height, left, top } = table.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const rotateX = (y / height - 0.5) * 10; // Max 10 degrees rotation
      const rotateY = (x / width - 0.5) * -10;

      table.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      table.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    };

    if (table) {
      table.addEventListener("mousemove", handleMouseMove);
      table.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (table) {
        table.removeEventListener("mousemove", handleMouseMove);
        table.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const initialDateTask = localStorage.getItem("selectedDate")
    ? localStorage.getItem("selectedDate")
    : new Date().toLocaleDateString("en-GB");

  const [dateTask, setDateTask] = useState(initialDateTask);
  const [specialDates, setSpecialDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hasSpun, setHasSpun] = useState(false);

  const handleMouseEnter = () => {
    if (!hasSpun) {
      setHasSpun(true);
    }
  };

  const handleMouseExit = () => {
    if (hasSpun) {
      setHasSpun(false);
    }
  };

  const formatDateToDDMMYYYY = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchStreakDates = async () => {
    try {
      const user = await User.fetch(userId);
      const streakDates = user.streak.getDates();
      console.log(streakDates);
      setSpecialDates(streakDates);
    } catch (error) {
      console.error("Error fetching streak dates:", error);
    }
  };

  const reloadWithTask = () => {
    window.location.reload();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  useEffect(() => {
    fetchStreakDates();
  }, [userId]);

  useEffect(() => {
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    const days = [];
    let day = new Date(startOfMonth);

    const firstDayOfWeek = startOfMonth.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    while (day <= endOfMonth) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }

    setCalendarDays(days);
  }, [currentMonth]);

  const getTaskListOfDay = (day) => {
    const formattedDate = formatDateToDDMMYYYY(day);
    console.log("Task list for:", formattedDate);
    localStorage.setItem("selectedDate", formattedDate);
    setDateTask(formattedDate);
  };

  return (
    <div className={styles.streak_calendar_container}>
      <TaskForm reloadWithTask={reloadWithTask} setDateTask={setDateTask} />
      <br />
      <br />
      <br></br>
      <div
        ref={tableRef}
        className={`${styles.streak_calendar_table} ${
          hasSpun ? styles.spin : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseExit}
      >
        <h2 className={styles.streak_calendar_title}>
          Streak Calendar -{" "}
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <div className={styles.navigation_buttons}>
          <button
            onClick={handlePrevMonth}
            className={styles.prev_button}
            aria-label="Previous Month"
          ></button>
          <button
            onClick={handleNextMonth}
            className={styles.next_button}
            aria-label="Next Month"
          ></button>
        </div>

        <div className={styles.streak_calendar_grid}>
          <div className={styles.streak_calendar_header}>Sun</div>
          <div className={styles.streak_calendar_header}>Mon</div>
          <div className={styles.streak_calendar_header}>Tue</div>
          <div className={styles.streak_calendar_header}>Wed</div>
          <div className={styles.streak_calendar_header}>Thu</div>
          <div className={styles.streak_calendar_header}>Fri</div>
          <div className={styles.streak_calendar_header}>Sat</div>

          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={index} className={styles.streak_calendar_day} />;
            }

            const dayString = formatDateToDDMMYYYY(day);
            const isActivityDay = activityDays.includes(dayString);
            const isSpecialDay = specialDates.includes(dayString);
            const isSelectedDay = dateTask === dayString;
            const displayContent = specialDates.includes(dayString) ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <img
                  src="streak.svg"
                  alt="streak"
                  className={styles.streak_image}
                />
              </div>
            ) : (
              day.getDate()
            );

            return (
              <div
                key={index}
                className={`${styles.streak_calendar_day} ${
                  isActivityDay ? styles.activity : ""
                } ${isSpecialDay ? styles.special : ""} ${
                  isSelectedDay ? styles.selected_day : ""
                }`}
                onClick={() => getTaskListOfDay(day)}
              >
                {displayContent}
              </div>
            );
          })}
        </div>
      </div>
      <br />
      <TaskList reloadWithTask={reloadWithTask} dateTask={dateTask} />
    </div>
  );
};

export default StreakCalendar;
