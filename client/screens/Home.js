import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as api from '../services/api';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('Medium');

  // Comment & Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [commentText, setCommentText] = useState('');

  const mockUserId = "user_001";

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const response = await api.getTasks(mockUserId);
      setTasks(response.data);

      // Keep the modal's data in sync if it's open
      if (selectedTask) {
        const updated = response.data.find(t => t._id === selectedTask._id);
        if (updated) setSelectedTask(updated);
      }
    } catch (err) { console.log("Fetch error:", err); }
  };

  // --- TASK CRUD ---
  const handleAddTask = async () => {
    if (!taskName) return;
    try {
      await api.createTask({
        title: taskName,
        userId: mockUserId,
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
      const response = await api.addComment(selectedTask._id, commentText);
      setSelectedTask(response.data); // Update modal immediately
      setCommentText('');
      loadTasks(); 
    } catch (err) { Alert.alert("Error", "Could not add comment"); }
  };

  const handleEditComment = (commentId, oldText) => {
    Alert.prompt("Edit Comment", "Update your comment:", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Save", 
        onPress: async (newText) => {
          if (!newText) return;
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
    } catch (err) { Alert.alert("Error", "Could not delete comment"); }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
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
            {/* 1. CHECKBOX */}
            <TouchableOpacity onPress={() => toggleComplete(item)}>
              <Text style={{ fontSize: 22, marginRight: 10 }}>
                {item.completed ? "✅" : "⬜"}
              </Text>
            </TouchableOpacity>

            {/* 2. TEXT (Click to Edit Task Name) */}
            <TouchableOpacity style={{ flex: 1 }} onPress={() => handleEditTaskName(item)}>
              <Text style={[styles.taskText, item.completed && styles.done]}>
                {item.title}
              </Text>
              <Text style={styles.taskSubtext}>{item.priority} Priority</Text>
            </TouchableOpacity>

            {/* 3. COMMENT ICON */}
            <TouchableOpacity
              style={styles.commentBtn}
              onPress={() => { setSelectedTask(item); setShowModal(true); }}
            >
              <Text style={{ color: '#2a9d7a' }}>💬 {item.comments?.length || 0}</Text>
            </TouchableOpacity>

            {/* 4. DELETE TASK */}
            <TouchableOpacity onPress={async () => { await api.deleteTask(item._id); loadTasks(); }}>
              <Text style={{ color: 'red', fontWeight: 'bold', marginLeft: 15 }}>Del</Text>
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
                      <Text style={{ color: 'red', fontSize: 12 }}>Remove</Text>
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
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  stats: { fontSize: 16, color: '#2a9d7a', marginBottom: 15 },
  priorityRow: { flexDirection: 'row', marginBottom: 10, gap: 10 },
  pBtn: { padding: 8, borderRadius: 5, backgroundColor: '#333' },
  pBtnActive: { backgroundColor: '#2a9d7a' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 5 },
  addButton: { backgroundColor: '#2a9d7a', padding: 12, marginLeft: 10, borderRadius: 5, justifyContent: 'center' },
  taskItem: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10 },
  taskText: { fontSize: 16, fontWeight: '600', color: '#151414' },
  taskSubtext: { fontSize: 12, color: '#666' },
  done: { textDecorationLine: 'line-through', color: '#aaa' },
  commentBtn: { backgroundColor: '#e8f5e9', padding: 5, borderRadius: 5, marginLeft: 10 },

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