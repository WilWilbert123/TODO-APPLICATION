import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'; // ✅ Added Redux hooks
import { logout } from '../redux/store'; // ✅ Added logout action
import * as api from '../services/api';
const Home = () => {
  const dispatch = useDispatch();

  // ✅ Replace mockUserId with the user from Redux store
  const user = useSelector((state) => state.tasks.user);

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('Medium');

  // Comment & Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [commentText, setCommentText] = useState('');

  // ✅ Fetch tasks whenever the component loads or user changes
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      // ✅ Use the dynamic 'user' from Redux for the API call
      const response = await api.getTasks(user);
      setTasks(response.data);

      // Keep the modal's data in sync if it's open
      if (selectedTask) {
        const updated = response.data.find(t => t._id === selectedTask._id);
        if (updated) setSelectedTask(updated);
      }
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  // --- TASK CRUD ---
  const handleAddTask = async () => {
    if (!taskName) return;
    try {
      await api.createTask({
        title: taskName,
        userId: user, // ✅ Set userId based on logged-in user
        priority: priority
      });
      setTaskName('');
      setPriority('Medium');
      loadTasks();
    } catch (error) {
      Alert.alert("Error", "Check server connection.");
    }
  };

  const toggleComplete = async (item) => {
    await api.updateTask(item._id, { completed: !item.completed });
    loadTasks();
  };

  const handleEditTaskName = (item) => {
    Alert.prompt("Edit Task", "Update task title:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update",
        onPress: async (newName) => {
          if (!newName) return;
          await api.updateTask(item._id, { title: newName });
          loadTasks();
        }
      }
    ], "plain-text", item.title);
  };

  // --- COMMENT CRUD ---
  const handleAddComment = async () => {
    if (!commentText) return;
    try {
      // ✅ Automatically prefix the comment with the user's name
      const commentWithAuthor = `${user}: ${commentText}`;

      const response = await api.addComment(selectedTask._id, commentWithAuthor);
      setSelectedTask(response.data); // Update modal immediately
      setCommentText('');
      loadTasks();
    } catch (err) {
      Alert.alert("Error", "Could not add comment");
    }
  };

  const handleEditComment = (commentId, oldText) => {
    Alert.prompt("Edit Comment", "Update your comment:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Save",
        onPress: async (newText) => {
          if (!newText) return;
          // Note: If you want to keep the "Name: " prefix, handle it here
          const response = await api.updateComment(selectedTask._id, commentId, newText);
          setSelectedTask(response.data);
          loadTasks();
        }
      }
    ], "plain-text", oldText);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await api.deleteComment(selectedTask._id, commentId);
      setSelectedTask(response.data.task);
      loadTasks();
    } catch (err) {
      Alert.alert("Error", "Could not delete comment");
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const getPriorityColor = (p) => {
    switch (p) {
      case 'High': return '#f2baba';   // Yellow
      case 'Medium': return '#eaefba'; // Green
      case 'Low': return '#c3f0c9';    // Red
      default: return '#ffffff';
    }
  };
  return (
    <View style={styles.container}>
      {/* ✅ Added Header with Username and Logout */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Todo List</Text>
          <Text style={styles.userText}> {user}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.stats}>Completed: {completedCount} / {tasks.length}</Text>

      {/* Priority Selector */}
      <View style={styles.priorityRow}>
        {['High', 'Medium', 'Low'].map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.pBtn, priority === p && styles.pBtnActive]}
            onPress={() => setPriority(p)}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add task name..."
          value={taskName}
          onChangeText={setTaskName}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleComplete(item)}>
              <Text style={{ fontSize: 22, marginRight: 10 }}>
                {item.completed ? "✅" : "⬜"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flex: 1 }} onPress={() => handleEditTaskName(item)}>
              <Text style={[styles.taskText, item.completed && styles.done]}>
                {item.title}
              </Text>
              <Text style={[styles.taskSubtext, { color: getPriorityColor(item.priority) }]}>
                {item.priority} Priority
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.commentBtn}
              onPress={() => { setSelectedTask(item); setShowModal(true); }}
            >
              <Text style={{ color: '#2a9d7a' }}>💬 {item.comments?.length || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                Alert.alert(
                  "Delete Task",
                  "Are you sure?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete", style: "destructive", onPress: async () => {
                        await api.deleteTask(item._id);
                        loadTasks();
                      }
                    }
                  ]
                );
              }}
              style={styles.deleteBtn}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={18} color="#ff4444" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* --- COMMENTS MODAL --- */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Comments: {selectedTask?.title}</Text>

            <ScrollView style={styles.commentList}>
              {selectedTask?.comments?.map((c) => (
                <View key={c._id} style={styles.commentItem}>
                  <Text style={{ flex: 1 }}>{c.text}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => handleEditComment(c._id, c.text)}>
                      <Text style={{ color: 'blue', fontSize: 12, marginRight: 15 }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteComment(c._id)}>
                      <Text style={{ color: 'orange', fontSize: 12 }}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TextInput
              style={styles.modalInput}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              placeholderTextColor="#888"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                <Text style={{ color: '#666' }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postBtn} onPress={handleAddComment}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#151414' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  userText: { color: '#2a9d7a', fontSize: 14, fontWeight: '500' },
  logoutBtn: { padding: 8, backgroundColor: '#331111', borderRadius: 5, position: 'absolute', right: 0, top: -35 },
  logoutText: { color: '#fefefe', fontWeight: 'bold', fontSize: 12 },
  stats: { fontSize: 14, color: '#aaa', marginBottom: 5 },
  priorityRow: { flexDirection: 'row', marginBottom: 10, gap: 10 },
  pBtn: { padding: 8, borderRadius: 5, backgroundColor: '#333' },
  pBtnActive: { backgroundColor: '#2a9d7a' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 5 },
  addButton: { backgroundColor: '#2a9d7a', padding: 12, marginLeft: 10, borderRadius: 5, justifyContent: 'center' },
  taskItem: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#180a0a00', borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#676363' },
  taskText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  taskSubtext: { fontSize: 12, color: '#f5f6f5' },
  done: { textDecorationLine: 'line-through', color: '#aaa' },
  commentBtn: { padding: 5, borderRadius: 5, marginLeft: 10 },
  deleteBtn: { padding: 5, marginLeft: 10, justifyContent: 'center', alignItems: 'center', },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 15, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  commentList: { maxHeight: 200, marginBottom: 10 },
  commentItem: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15, color: 'black' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  postBtn: { backgroundColor: '#2a9d7a', padding: 10, borderRadius: 5, width: '45%', alignItems: 'center' },
  closeBtn: { padding: 10, width: '45%', alignItems: 'center' }
});