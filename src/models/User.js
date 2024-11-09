import { ref, set, get } from "firebase/database";
import { realDb } from "../firebase";
import { Streak } from "./Streak";

export class User {
  constructor(
    userId,
    username,
    password,
    birthdate,
    country,
    email,
    imageUrl = null
  ) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.birthdate = birthdate;
    this.country = country;
    this.email = email;
    this.tasks = {};
    this.streak = new Streak();
    this.imageUrl = imageUrl;
  }

  save() {
    const userRef = ref(realDb, `users/${this.userId}`);
    return set(userRef, {
      username: this.username,
      password: this.password,
      birthdate: this.birthdate,
      country: this.country,
      email: this.email,
      tasks: this.tasks,
      streak: this.streak.getDates(),
      imageUrl: this.imageUrl,
    });
  }

  addTask(task) {
    this.tasks[task.taskId] = task;
    return this.save();
  }

  updateTask(taskId, updates) {
    if (this.tasks[taskId]) {
      Object.assign(this.tasks[taskId], updates);
      return this.save().then(() => this.updateStreak());
    }
  }

  updateStreak(date) {
    const tasksForDate = Object.values(this.tasks).filter(
      (task) => task.date === date
    );

    if (tasksForDate.length === 0) {
      console.log("No tasks found for this date.");
      this.streak.removeDate(date);
    } else {
      const allTasksDone = tasksForDate.every((task) => task.is_done);
      if (allTasksDone) {
        if (!this.streak.getDates().includes(date)) {
          this.streak.addDate(date);
        } else {
          console.log("Date is already in the streak.");
        }
      } else {
        this.streak.removeDate(date);
      }
    }
    return this.save();
  }

  static fetch(userId) {
    const userRef = ref(realDb, `users/${userId}`);
    return get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const user = new User(
          userId,
          data.username,
          data.password,
          data.birthdate,
          data.country,
          data.email,
          data.imageUrl || null
        );
        user.tasks = data.tasks || {};
        user.streak = new Streak();
        user.streak.dates = data.streak || [];
        return user;
      } else {
        throw new Error("User not found");
      }
    });
  }
}
