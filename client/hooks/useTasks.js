import { useEffect, useState } from 'react';
import * as api from '../services/api';

export const useTasks = (user) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    try {
      const response = await api.getTasks(user);
      setTasks(response.data);
      return response.data;
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const addTask = async (title, priority) => {
    if (!title) return;
    await api.createTask({ title, userId: user, priority });
    await loadTasks();
  };

  const toggleTask = async (item) => {
    await api.updateTask(item._id, { completed: !item.completed });
    await loadTasks();
  };

  const editTask = async (id, newTitle) => {
    await api.updateTask(id, { title: newTitle });
    await loadTasks();
  };

  useEffect(() => {
    if (user) loadTasks();
  }, [user]);

  return { tasks, loadTasks, addTask, toggleTask, editTask };
};