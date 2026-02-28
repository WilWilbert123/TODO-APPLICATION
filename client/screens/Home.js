import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useTasks } from '../hooks/useTasks';
import { logout } from '../redux/store';
import * as api from '../services/api';

import CommentsModal from '../components/CommentsModal';
import TaskItem from '../components/TaskItem';
import { getPriorityStyle, getTheme } from '../constants/theme';

const Home = () => {
  const dispatch = useDispatch();
  const { tasks, user, loadTasks, addTask, toggleTask, editTask, deleteTask } = useTasks();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = getTheme(isDarkMode);

  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => { loadTasks(); }, []);

  // Sync selected task with updated task list (for comments)
  useEffect(() => {
    const selectedId = selectedTask?._id?.$oid || selectedTask?._id;
    if (selectedId && tasks.length > 0) {
      const updated = tasks.find(t => (t._id?.$oid || t._id) === selectedId);
      if (updated) setSelectedTask(updated);
    }
  }, [tasks]);

  const handleAddComment = async () => {
    const taskId = selectedTask?._id?.$oid || selectedTask?._id;
    if (!commentText || !taskId) return;

    try {
      const response = await api.addComment(taskId, `${user}: ${commentText}`);
      setSelectedTask(response.data);
      setCommentText('');
      loadTasks();
    } catch (err) {
      console.log("Add Comment Error:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const taskId = selectedTask?._id?.$oid || selectedTask?._id;
    const cId = commentId?.$oid || commentId; // Handle nested comment ID
    if (!taskId || !cId) return;

    try {
      const response = await api.deleteComment(taskId, cId);
      setSelectedTask(response.data.task);
      loadTasks();
    } catch (err) {
      console.log("Delete Comment Error:", err);
    }
  };
const handleEditComment = async (commentId, newText) => {
    const taskId = selectedTask?._id?.$oid || selectedTask?._id;
    try {
        // Prepend user back if necessary
        const formattedText = `${user}: ${newText}`;
        const response = await api.updateComment(taskId, commentId, formattedText);
        setSelectedTask(response.data); 
        loadTasks();
    } catch (err) {
        console.error("Edit Comment Error:", err);
    }
};
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.welcomeText, { color: theme.subText }]}>Welcome back,</Text>
          <Text style={[styles.userText, { color: theme.text }]}>{user} 👋</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.actionCircle, { backgroundColor: theme.surface }]} onPress={() => setIsDarkMode(!isDarkMode)}>
            <MaterialCommunityIcons name={isDarkMode ? "white-balance-sunny" : "moon-waning-crescent"} size={22} color={isDarkMode ? "#FFC107" : "#6366F1"} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCircle, { backgroundColor: theme.surface, marginLeft: 12 }]} onPress={() => dispatch(logout())}>
            <MaterialCommunityIcons name="logout" size={20} color={theme.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.statsCard, { backgroundColor: theme.accent }]}>
        <View>
          <Text style={styles.statsTitle}>Progress</Text>
          <Text style={styles.statsSub}>{completedCount} of {tasks.length} tasks completed</Text>
        </View>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>{tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%</Text>
        </View>
      </View>

      <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}>
        <TextInput style={[styles.input, { color: theme.text }]} placeholder="New task..." value={taskName} onChangeText={setTaskName} placeholderTextColor={theme.subText} />
        <View style={styles.prioritySelector}>
          {['High', 'Medium', 'Low'].map((p) => (
            <TouchableOpacity key={p} style={[styles.pBadge, priority === p && { backgroundColor: getPriorityStyle(p, isDarkMode, theme).color }]} onPress={() => setPriority(p)}>
              <Text style={[styles.pBadgeText, priority === p && { color: isDarkMode ? '#000' : '#FFF' }]}>{p[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => { addTask(taskName, priority); setTaskName(''); }}>
          <MaterialCommunityIcons name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id?.$oid || item._id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            item={item} theme={theme} isDarkMode={isDarkMode}
            onToggle={toggleTask}
            onEdit={(i) => Alert.prompt("Edit", "Update title:", [{ text: "Save", onPress: (n) => editTask(i._id, n) }], "plain-text", i.title)}
            onDelete={() => {
              if (item._id) {
                deleteTask(item._id);
              } else {
                console.error("This item has no ID!", item);
              }
            }}
            onComment={(i) => { setSelectedTask(i); setShowModal(true); }}
          />
        )}
      />

      <CommentsModal
        visible={showModal} onClose={() => setShowModal(false)}
        task={selectedTask} commentText={commentText} setCommentText={setCommentText}
        onAdd={handleAddComment} onDelete={handleDeleteComment}
        theme={theme} isDarkMode={isDarkMode}
        onEdit={handleEditComment}
        
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  welcomeText: { fontSize: 14, fontWeight: '500' },
  userText: { fontSize: 24, fontWeight: 'bold' },
  actionCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statsCard: { padding: 22, borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, elevation: 8 },
  statsTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  statsSub: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 2 },
  progressCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  progressText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, padding: 8, marginBottom: 25 },
  input: { flex: 1, paddingHorizontal: 15, fontSize: 16 },
  prioritySelector: { flexDirection: 'row', gap: 6, marginRight: 10 },
  pBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  pBadgeText: { fontSize: 11, fontWeight: 'bold' },
  addButton: { backgroundColor: '#2a9d7a', width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 4 },
});

export default Home;