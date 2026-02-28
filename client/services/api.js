import axios from 'axios';

const API_URL = 'http://192.168.0.223:5000/api/tasks'; 

// Task CRUD
export const getTasks = (userId) => axios.get(`${API_URL}?userId=${userId}`);
export const createTask = (task) => axios.post(API_URL, task);
export const updateTask = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`);

// Comment Routes
export const addComment = (taskId, text) => axios.post(`${API_URL}/${taskId}/comments`, { text });
export const updateComment = (taskId, commentId, text) =>  axios.put(`${API_URL}/${taskId}/comments/${commentId}`, { text });
export const deleteComment = (taskId, commentId) => axios.delete(`${API_URL}/${taskId}/comments/${commentId}`);
