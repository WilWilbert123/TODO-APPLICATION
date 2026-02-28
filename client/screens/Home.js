import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/store';
import * as api from '../services/api';

// Imports from our new files
import CommentsModal from '../components/CommentsModal';
import TaskItem from '../components/TaskItem';
import { getPriorityStyle, getTheme } from '../constants/theme';

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.tasks.user);

  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = getTheme(isDarkMode);

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => { if (user) loadTasks(); }, [user]);

  const loadTasks = async () => {
    try {
      const response = await api.getTasks(user);
      setTasks(response.data);
      if (selectedTask) {
        const updated = response.data.find(t => t._id === selectedTask._id);
        if (updated) setSelectedTask(updated);
      }
    } catch (err) { console.log(err); }
  };

  const handleAddTask = async () => {
    if (!taskName) return;
    await api.createTask({ title: taskName, userId: user, priority });
    setTaskName('');
    loadTasks();
  };

  const handleEditTaskName = (item) => {
    Alert.prompt("Edit Task", "Update task title:", [
      { text: "Cancel" },
      { text: "Update", onPress: async (n) => { await api.updateTask(item._id, { title: n }); loadTasks(); } }
    ], "plain-text", item.title);
  };

  const handleAddComment = async () => {
    if (!commentText) return;
    const response = await api.addComment(selectedTask._id, `${user}: ${commentText}`);
    setSelectedTask(response.data);
    setCommentText('');
    loadTasks();
  };

  const handleDeleteComment = async (id) => {
    const response = await api.deleteComment(selectedTask._id, id);
    setSelectedTask(response.data.task);
    loadTasks();
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* HEADER */}
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

      {/* STATS */}
      <View style={[styles.statsCard, { backgroundColor: theme.accent }]}>
        <View>
          <Text style={styles.statsTitle}>Progress</Text>
          <Text style={styles.statsSub}>{completedCount} of {tasks.length} tasks completed</Text>
        </View>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>{tasks.length > 0 ? Math.round((completedCount/tasks.length)*100) : 0}%</Text>
        </View>
      </View>

      {/* INPUT */}
      <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}>
        <TextInput style={[styles.input, { color: theme.text }]} placeholder="Input Task?" value={taskName} onChangeText={setTaskName} placeholderTextColor={theme.subText} />
        <View style={styles.prioritySelector}>
          {['High', 'Medium', 'Low'].map((p) => (
            <TouchableOpacity key={p} style={[styles.pBadge, priority === p && { backgroundColor: getPriorityStyle(p, isDarkMode, theme).color }]} onPress={() => setPriority(p)}>
              <Text style={[styles.pBadgeText, priority === p && { color: isDarkMode ? '#000' : '#FFF' }]}>{p[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <MaterialCommunityIcons name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={tasks}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskItem 
            item={item} theme={theme} isDarkMode={isDarkMode}
            onToggle={async (i) => { await api.updateTask(i._id, { completed: !i.completed }); loadTasks(); }}
            onEdit={handleEditTaskName}
            onComment={(i) => { setSelectedTask(i); setShowModal(true); }}
          />
        )}
      />

      <CommentsModal 
        visible={showModal} onClose={() => setShowModal(false)}
        task={selectedTask} commentText={commentText} setCommentText={setCommentText}
        onAdd={handleAddComment} onDelete={handleDeleteComment}
        theme={theme} isDarkMode={isDarkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  welcomeText: { fontSize: 14, fontWeight: '500' },
  userText: { fontSize: 24, fontWeight: 'bold' },
  actionCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statsCard: { padding: 22, borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, elevation: 8, shadowColor: '#2a9d7a', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }},
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