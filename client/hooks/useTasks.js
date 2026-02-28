import { useDispatch, useSelector } from 'react-redux';
import { setTasks } from '../redux/store';
import * as api from '../services/api';

export const useTasks = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.tasks.user);
  const tasks = useSelector((state) => state.tasks.items);

  const loadTasks = async () => {
    try {
      const response = await api.getTasks(user);
      
    
      const cleanTasks = response.data.map(task => ({
        ...task,
        _id: task._id?.$oid || task._id, // Flatten task ID
        comments: task.comments?.map(comment => ({
          ...comment,
          _id: comment._id?.$oid || comment._id // Flatten comment IDs
        }))
      }));

      dispatch(setTasks(cleanTasks));
    } catch (err) {
      console.log("Load Tasks Error:", err);
    }
  };

  const addTask = async (title, priority) => {
    if (!title) return;
    try {
      await api.createTask({ title, userId: user, priority });
      await loadTasks();
    } catch (err) { console.log(err); }
  };

  const toggleTask = async (item) => {
    try {
      // Now item._id is guaranteed to be a string!
      await api.updateTask(item._id, { completed: !item.completed });
      await loadTasks();
    } catch (err) { console.log(err); }
  };

  const editTask = async (id, newTitle) => {
    try {
      // id is now a string thanks to our cleaning in loadTasks
      await api.updateTask(id, { title: newTitle });
      await loadTasks();
    } catch (err) { console.log(err); }
  };

  const deleteTask = async (id) => {
    try {
      // No more complex checks needed here
      await api.deleteTask(id);
      await loadTasks();
    } catch (err) {
      console.error("Delete Task Error:", err.response?.data || err.message);
    }
  };

  return { tasks, user, loadTasks, addTask, toggleTask, editTask, deleteTask };
};