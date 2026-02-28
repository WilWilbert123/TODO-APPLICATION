import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getPriorityStyle } from '../constants/theme';

const TaskItem = ({ item, theme, isDarkMode, onToggle, onEdit, onComment, onDelete }) => {
  const pStyle = getPriorityStyle(item.priority, isDarkMode, theme);

  return (
    <View style={[styles.taskCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <TouchableOpacity onPress={() => onToggle(item)} style={styles.checkIcon}>
        <MaterialCommunityIcons 
          name={item.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
          size={28} 
          color={item.completed ? theme.accent : theme.subText} 
        />
      </TouchableOpacity>

      <TouchableOpacity style={{ flex: 1 }} onPress={() => onEdit(item)}>
        <Text style={[styles.taskTitle, { color: theme.text }, item.completed && styles.doneText]}>
          {item.title}
        </Text>
        <View style={[styles.priorityTag, { backgroundColor: pStyle.bg }]}>
          <Text style={[styles.priorityTagText, { color: pStyle.color }]}>{item.priority}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => onComment(item)}>
          <MaterialCommunityIcons name="comment-text-outline" size={22} color={theme.subText} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item._id)} style={{ marginLeft: 15 }}>
          <MaterialCommunityIcons name="trash-can-outline" size={22} color={theme.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 22, marginBottom: 14, borderWidth: 1 },
  checkIcon: { marginRight: 15 },
  taskTitle: { fontSize: 17, fontWeight: '600', marginBottom: 5 },
  doneText: { textDecorationLine: 'line-through', opacity: 0.4 },
  priorityTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  priorityTagText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
});

export default TaskItem;